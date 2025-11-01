const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { spawn } = require("child_process");

const pagesDir = path.join(__dirname, "pages");
const uploadsDir = path.join(__dirname, "uploads");
const processedDir = path.join(__dirname, "processed");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);

// Job queue
let queue = [];

// Track progress { filename: percent }
let progressMap = {};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve pages
  if (pathname === "/" || pathname === "/index") {
    servePage("index.html", res);
  } else if (pathname === "/upload") {
    servePage("upload.html", res);
  } else if (pathname === "/queue") {
    serveQueue(res);
  } else if (pathname.startsWith("/video/")) {
    const filename = pathname.split("/video/")[1];
    serveVideo(filename, req, res);
  } else if (pathname === "/upload-video" && req.method === "POST") {
    handleUpload(req, res);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);

// ---------------------- FUNCTIONS ----------------------

function servePage(file, res) {
  const filePath = path.join(pagesDir, file);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Page not found");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

// Queue page with progress bars
function serveQueue(res) {
  const files = fs.readdirSync(uploadsDir);
  let tableRows = "";
  for (let file of files) {
    const status = progressMap[file]
      ? "Processing"
      : fs.existsSync(path.join(processedDir, file))
      ? "Completed"
      : "Queued";
    const percent = progressMap[file] || 0;
    tableRows += `
      <tr>
        <td>${file}</td>
        <td>${status}</td>
        <td>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${percent}%">${percent}%</div>
          </div>
        </td>
        <td>
          ${
            status === "Completed"
              ? `<a href="/video/${file}" class="btn btn-sm btn-success">View</a>`
              : ""
          }
        </td>
      </tr>
    `;
  }

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Queue</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container py-5">
      <h2 class="mb-4 text-center">Video Processing Queue</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Video Name</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div class="text-center mt-4">
        <a href="/upload" class="btn btn-outline-primary">Upload New Video</a>
        <a href="/" class="btn btn-outline-secondary">Home</a>
      </div>
    </div>
  </body>
  </html>
  `;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

// Serve video with byte-range support for progressive playback
function serveVideo(filename, req, res) {
  const videoPath = path.join(processedDir, filename);
  fs.stat(videoPath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.end("Video not found");
      return;
    }

    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Content-Length": stats.size,
      });
      fs.createReadStream(videoPath).pipe(res);
      return;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

    if (start >= stats.size || end >= stats.size) {
      res.writeHead(416, { "Content-Range": `bytes */${stats.size}` });
      res.end();
      return;
    }

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stats.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  });
}

// Handle file upload (very basic, demo only)
function handleUpload(req, res) {
  let body = Buffer.alloc(0);

  req.on("data", (chunk) => {
    body = Buffer.concat([body, chunk]);
  });

  req.on("end", () => {
    // Parse multipart form-data (simplified, for demo only)
    const boundary = req.headers["content-type"].split("boundary=")[1];
    const parts = body.toString().split(`--${boundary}`);
    for (let part of parts) {
      if (part.includes("Content-Disposition") && part.includes("filename=")) {
        const match = part.match(/filename="(.+)"/);
        if (!match) continue;
        const filename = match[1];
        const start = part.indexOf("\r\n\r\n") + 4;
        const end = part.lastIndexOf("\r\n");
        const fileData = Buffer.from(part.substring(start, end), "binary");
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, fileData);
        queue.push(filename);
        progressMap[filename] = 0;
        processQueue(); // start processing
      }
    }
    res.writeHead(302, { Location: "/queue" });
    res.end();
  });
}

// Process the queue with FFmpeg
function processQueue() {
  if (!queue.length) return;
  const file = queue.shift();
  const input = path.join(uploadsDir, file);
  const output = path.join(processedDir, file);

  // FFmpeg: just copy for demo, can transcode if needed
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    input,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-y",
    output,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    const str = data.toString();
    const match = str.match(/time=(\d+:\d+:\d+\.\d+)/);
    if (match) {
      // For simplicity, just fake progress increment
      progressMap[file] = Math.min(progressMap[file] + 5, 100);
    }
  });

  ffmpeg.on("close", () => {
    progressMap[file] = 100;
    processQueue(); // process next in queue
  });
}
