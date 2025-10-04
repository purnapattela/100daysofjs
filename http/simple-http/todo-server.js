/**
 * server.js
 * Node.js HTTP server implementing:
 *  - User registration & login (password hashing with scrypt)
 *  - Token generation/validation using crypto HMAC (signed token)
 *  - Todo CRUD (in-memory + persisted to data.json)
 *  - Serves client.html at '/'
 *
 * No external modules used.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// secret for HMAC signing of tokens — in production persist securely
const TOKEN_SECRET = crypto.randomBytes(32).toString('hex');

// simple app state persisted to DATA_FILE
let state = {
    users: [], // { id, username, passwordHash (hex), salt (hex) }
    todos: [], // { id, userId, title, completed, createdAt, updatedAt }
    lastIds: { user: 0, todo: 0 }
};

// --- Persistence helpers ---
function loadState() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        state = JSON.parse(raw);
        console.log('Loaded state from', DATA_FILE);
    } catch (e) {
        console.log('No existing data file — starting fresh.');
        saveState();
    }
}

function saveState() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// --- Utility helpers ---
function jsonResponse(res, code, payload) {
    const body = JSON.stringify(payload || {});
    res.writeHead(code, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
}

function notFound(res) {
    jsonResponse(res, 404, { error: 'Not Found' });
}

function badRequest(res, message) {
    jsonResponse(res, 400, { error: message || 'Bad Request' });
}

function unauthorized(res, message = 'Unauthorized') {
    jsonResponse(res, 401, { error: message });
}

function parseJSONBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
            // simple protection
            if (data.length > 1e7) {
                reject(new Error('Payload too large'));
                req.destroy();
            }
        });
        req.on('end', () => {
            if (!data) return resolve(null);
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

// --- Password helpers (scrypt) ---
function hashPassword(password, saltHex) {
    const salt = Buffer.from(saltHex, 'hex');
    const derived = crypto.scryptSync(password, salt, 64);
    return derived.toString('hex');
}

function generateSaltHex() {
    return crypto.randomBytes(16).toString('hex');
}

// --- Token helpers (simple signed token similar to JWT) ---
function base64UrlEncode(buf) {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64');
}

/**
 * Generate a signed token: base64url(payloadJSON).signatureHex
 * Payload: { uid, exp } (exp is epoch seconds)
 */
function generateToken(userId, expiresInSeconds = 60 * 60 * 24) {
    const payload = { uid: userId, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
    const payloadStr = JSON.stringify(payload);
    const payloadB64 = base64UrlEncode(Buffer.from(payloadStr, 'utf8'));
    const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('hex');
    return `${payloadB64}.${signature}`;
}

/**
 * Verify token and return payload if valid, otherwise null
 */
function verifyToken(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(expectedSig, 'hex'), Buffer.from(signature, 'hex'))) {
        return null;
    }
    try {
        const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8'));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

// --- Auth middleware (for routes) ---
function getBearerTokenFromReq(req) {
    const auth = req.headers['authorization'] || '';
    const m = auth.match(/^Bearer (.+)$/);
    return m ? m[1] : null;
}

function requireAuth(req, res) {
    const token = getBearerTokenFromReq(req);
    const payload = verifyToken(token);
    if (!payload) {
        unauthorized(res, 'Invalid or missing token');
        return null;
    }
    const user = state.users.find(u => u.id === payload.uid);
    if (!user) {
        unauthorized(res, 'User not found');
        return null;
    }
    return user;
}

// --- Basic router ---
async function handleRequest(req, res) {
    const parsed = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsed.pathname;

    // Serve client HTML at root
    if (method === 'GET' && (pathname === '/' || pathname === '/client.html')) {
        const clientPath = path.join(__dirname, 'client.html');
        if (fs.existsSync(clientPath)) {
            const html = fs.readFileSync(clientPath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        } else {
            notFound(res);
            return;
        }
    }

    // STATIC: serve /bundle for client assets if any (none in this sample), or other static files
    if (method === 'GET' && pathname.startsWith('/static/')) {
        const fp = path.join(__dirname, pathname);
        if (fs.existsSync(fp)) {
            const data = fs.readFileSync(fp);
            res.writeHead(200);
            res.end(data);
        } else notFound(res);
        return;
    }

    // API prefix
    if (pathname.startsWith('/api/')) {
        // Registration
        if (method === 'POST' && pathname === '/api/register') {
            try {
                const body = await parseJSONBody(req);
                if (!body || !body.username || !body.password) {
                    return badRequest(res, 'username and password required');
                }
                const existing = state.users.find(u => u.username === body.username);
                if (existing) return badRequest(res, 'username taken');

                const salt = generateSaltHex();
                const passwordHash = hashPassword(body.password, salt);
                const id = ++state.lastIds.user;
                const user = { id, username: body.username, passwordHash, salt };
                state.users.push(user);
                saveState();
                jsonResponse(res, 201, { id: user.id, username: user.username });
                return;
            } catch (e) {
                return badRequest(res, 'invalid json');
            }
        }

        // Login
        if (method === 'POST' && pathname === '/api/login') {
            try {
                const body = await parseJSONBody(req);
                if (!body || !body.username || !body.password) {
                    return badRequest(res, 'username and password required');
                }
                const user = state.users.find(u => u.username === body.username);
                if (!user) return unauthorized(res, 'invalid credentials');

                const attempted = hashPassword(body.password, user.salt);
                const ok = crypto.timingSafeEqual(Buffer.from(attempted, 'hex'), Buffer.from(user.passwordHash, 'hex'));
                if (!ok) return unauthorized(res, 'invalid credentials');

                const token = generateToken(user.id, 60 * 60 * 24 * 7); // 7 days
                jsonResponse(res, 200, { token, user: { id: user.id, username: user.username } });
                return;
            } catch (e) {
                return badRequest(res, 'invalid json');
            }
        }

        // Get current user (auth required)
        if (method === 'GET' && pathname === '/api/me') {
            const user = requireAuth(req, res);
            if (!user) return;
            jsonResponse(res, 200, { id: user.id, username: user.username });
            return;
        }

        // TODOS: /api/todos
        if (pathname === '/api/todos') {
            const user = requireAuth(req, res);
            if (!user) return;

            if (method === 'GET') {
                // return todos for user
                const todos = state.todos.filter(t => t.userId === user.id);
                return jsonResponse(res, 200, { todos });
            }

            if (method === 'POST') {
                try {
                    const body = await parseJSONBody(req);
                    if (!body || typeof body.title !== 'string') {
                        return badRequest(res, 'title required');
                    }
                    const id = ++state.lastIds.todo;
                    const now = new Date().toISOString();
                    const todo = {
                        id,
                        userId: user.id,
                        title: body.title,
                        completed: !!body.completed,
                        createdAt: now,
                        updatedAt: now,
                    };
                    state.todos.push(todo);
                    saveState();
                    return jsonResponse(res, 201, { todo });
                } catch (e) {
                    return badRequest(res, 'invalid json');
                }
            }
        }

        // Todo item by id: /api/todos/:id
        const todoMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
        if (todoMatch) {
            const id = Number(todoMatch[1]);
            const user = requireAuth(req, res);
            if (!user) return;
            const todo = state.todos.find(t => t.id === id && t.userId === user.id);
            if (!todo) return notFound(res);

            if (method === 'PUT' || method === 'PATCH') {
                try {
                    const body = await parseJSONBody(req);
                    if (!body) return badRequest(res, 'body required');
                    if (typeof body.title === 'string') todo.title = body.title;
                    if (typeof body.completed === 'boolean') todo.completed = body.completed;
                    todo.updatedAt = new Date().toISOString();
                    saveState();
                    return jsonResponse(res, 200, { todo });
                } catch (e) {
                    return badRequest(res, 'invalid json');
                }
            }

            if (method === 'DELETE') {
                state.todos = state.todos.filter(t => !(t.id === id && t.userId === user.id));
                saveState();
                return jsonResponse(res, 200, { success: true });
            }
            return notFound(res);
        }

        // unknown API route
        return notFound(res);
    }

    // fallback
    notFound(res);
}

// --- Start ---
loadState();

const server = http.createServer((req, res) => {
    // simple logging
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    handleRequest(req, res).catch(err => {
        console.error('Unhandled error:', err);
        jsonResponse(res, 500, { error: 'Internal Server Error' });
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
