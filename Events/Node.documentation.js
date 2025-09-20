// Events

/**
 * 'error' event is important to handle or else program halts if it encounters
 * errorMonitor is like addeding 'error' event to the calling eventemitter obj. They let you “monitor” errors without preventing the crash if there’s no "error" listener and handles that case and still crashes after handling
 * {captureRejections :true} only works in the async / primises
 * 
 */
const { EventEmitter, errorMonitor } = require("node:events")
class Emitter extends EventEmitter { }

const emitter = new Emitter({ captureRejections: true })

emitter.once("foo", () => {
    console.log("FOO called only once");
})

emitter.on("newListener", (eventname, listener) => {
    console.log(`New event is added : ${eventname.toString()}`);

})

emitter.on("foo", async () => {
    throw new Error("random error")
})

emitter.on(errorMonitor, (err) => {
    console.log("Error from monitoring..,", err);
})

emitter.on("error", (err) => {
    console.log("Some error\n", err);
})

emitter.emit("foo")
console.log("Code executed")
emitter.emit("foo")
