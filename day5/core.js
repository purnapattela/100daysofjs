const EventEmitter = require("node:events")
const { errorMonitor, captureRejections } = require("node:events")

class Events extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(1);
    };
}

const removeEvent = new Events({ errorMonitor: true, captureRejections: true });

const anonFn = () => {
    try {
        console.log("Event Ocuured");
        a;
    } catch (error) {
        removeEvent.emit("error", error); // if capture rejections : true them no need to have try- catch
    }
}

removeEvent.on("errorMonitor", () => {
    console.log("Error occured");
})

removeEvent.on("rm", anonFn)
// removeEvent.on("rm", anonFn, { capture: false }) // it will not listen for the event
// removeEvent.on("rm", () => {
//     console.log(`You get warning because we already set max listnings`);
// })

removeEvent.emit("rm")

removeEvent.on("error", (err) => {
    console.log("error occured somewhere");
    console.log(`
        
        
        The error is : ${err.message}
        
        `);

})

// removeEvent.removeAllListeners
// removeEvent.removeListener
removeEvent.off("rm", anonFn)  // - all the remaining works in same way

removeEvent.emit("rm")

/**
 * .listenerCount(), .listeners() - number , [listners]
 */

console.log(removeEvent.listeners());
console.log(removeEvent.listenerCount());

console.log(removeEvent.removeAllListeners("rm"));


