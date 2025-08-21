# Day 3 Learnings: #100DaysOfNode

## 1. What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JS code outside the browser. With Node, JS isn't just for browsers anymore—I can script my computer like Python or Bash, and build servers!

## 2. Node.js vs Browser JavaScript
- In Node.js, there's **no `window` or `document`**.
- Instead, I get global things like `process`, `global` and modules that talk to my system.
- I can do things like read files, check the OS, and build APIs. Browsers can’t do this.

## 3. Types of Functions
### Regular Function
### Arrow Function
### Async Function


## 4. Module Systems
### CommonJS (`require`)
- The OG Node.js way.
- Example: `const fs = require('fs');`

### ES Modules (`import`)
- Modern JS style.  
- Example: `import fs from 'fs';`
- Needs special setup in Node (type:module in package.json or .mjs extension).

## 5. Core Node.js Modules I Touched Today
- `fs` for files
- `path` for file paths
- `os` for system info

