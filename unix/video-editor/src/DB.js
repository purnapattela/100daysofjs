const fs = require("node:fs");

const videosPath = "./data/videos";
const usersPath = "./data/users";
const sessionsPath = "./data/sessions";

function safeReadJSON(path) {
  try {
    if (!fs.existsSync(path)) {
      console.warn(`⚠️ File not found: ${path}. Creating new empty JSON.`);
      fs.writeFileSync(path, "[]");
      return [];
    }

    const content = fs.readFileSync(path, "utf8").trim();
    if (!content) return [];

    return JSON.parse(content);
  } catch (err) {
    console.error(`❌ Error parsing JSON at ${path}:`, err.message);
    return [];
  }
}

class DB {
  constructor() {
    this.videos = safeReadJSON(videosPath);
    this.users = safeReadJSON(usersPath);
    this.sessions = safeReadJSON(sessionsPath);
  }

  update() {
    this.videos = safeReadJSON(videosPath);
    this.users = safeReadJSON(usersPath);
    this.sessions = safeReadJSON(sessionsPath);
  }

  save() {
    fs.writeFileSync(videosPath, JSON.stringify(this.videos, null, 2));
    fs.writeFileSync(usersPath, JSON.stringify(this.users, null, 2));
    fs.writeFileSync(sessionsPath, JSON.stringify(this.sessions, null, 2));
  }
}

const db = new DB();
module.exports = db;
