## UNIX

- 🧵 Worker Threads → parallel threads within one Node process (good for heavy JS computation).
- ⚙️ Child Processes → separate processes (good for running external commands or separate Node scripts).

---

### Where and What

| Situation                                        | Use                           | Why                                |
| ------------------------------------------------ | ----------------------------- | ---------------------------------- |
| Short, simple shell command with pipes/redirects | `exec()`                      | Easy and uses shell                |
| Command producing large output                   | `spawn()`                     | Streams data instead of buffering  |
| Long-running background process                  | `spawn()`                     | You can stream logs and manage I/O |
| Need both streaming + shell syntax               | `spawn(..., { shell: true })` | Best of both worlds                |
| Running a binary with no shell syntax            | `execFile()`                  | Safe, simple, fast                 |
| Handling user input or untrusted data            | `spawn()` / `execFile()`      | Avoid shell injection              |
