// Event emitters

import EventEmitter from 'node:events'

class Emitter extends EventEmitter { }

//  passing no parameters on event 

const noparams = new Emitter()

noparams.on("foo", () => {
    console.log("Event occured");
})

noparams.emit("foo")

// passing parameters on events
const prams = new Emitter()

prams.on("rrr", (...args) => {
    console.log(args);
})

prams.emit('rrr', 1, 2, 3, 4, 5)

// calling event once irrespective of the no of times event occured
const once = new Emitter()

once.once("once", () => {
    console.log("Once executed");
})

once.emit("once")
once.emit("once")


// 'this' in event emitter
const thiss = new Emitter()

thiss.on('thiss', () => {
    console.log(this); // undefined
})

thiss.on("thiss", function () {
    console.log(this); // logs emitter obj
})

thiss.emit("thiss")

// Asynchronous calling the event
const asyncCall = new Emitter()
asyncCall.on("async", () => {
    console.log("0. Inside event handler");

    setImmediate(() => {
        console.log("6. setImmediate inside event");
    });

    process.nextTick(() => {
        console.log("4. process.nextTick inside event");
    });

    console.log("1. End of event handler");
});

setImmediate(() => {
    console.log("5. Outside event: setImmediate");
});

process.nextTick(() => {
    console.log("3. Outside event: process.nextTick");
});

asyncCall.emit("async");

console.log("2. End of script");

// Error event
const err = new Emitter()

err.on("errorEvent", () => {
    try {
        throw new Error("Manually i created error");
    } catch (e) {
        err.emit("error", e);
    }
})

err.on("error", (err) => {
    console.log("Error occured : " + err.message);
})

err.emit("errorEvent")


// TODO : Day 5
/**
 * 1. errorMonitor
 * 2. EventEmitter({captureRejusctions : true})
 * 3. Event - newListener
 * 4. Removelistner
 * 5. Many more things...
 */