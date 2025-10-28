/**
 * URL : https://medium.com/@manikmudholkar831995/child-processes-multitasking-in-nodejs-751f9f7a85c8
 */
import { spawn, fork, exec, execFile } from "child_process";

// Each above of the methods returns a ChildProcess instance. Those objects implements the nodejs event-emitter.

// simple 'ls'
/*
const ls = spawn("ls", ["-lh"]);

ls.stdout.on("data", (data) => {
  console.log(`STD.OUT : ${data}`);
});

ls.stderr.on("data", (data) => {
  console.log(`STD.ERR : ${data}`);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
*/

// Lets use pipe (ps | grep bash)
/*
const ps = spawn("ps");
const grep = spawn("grep", ["bash"]);

ps.stdout.on("data", (data) => {
  grep.stdin.write(data);
});

ps.stderr.on("data", (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on("close", (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on("data", (data) => {
  console.log(data.toString());
});

grep.stderr.on("data", (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on("close", (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
*/
