/**
 * 1. Events
 */

const EventEmitter = require("node:events")

class Events extends EventEmitter { }

const myEvent = new Events()

myEvent.on("ev", () => {
    console.log("An event occured");
})
console.log(myEvent.eventNames());

myEvent.emit("ev")
