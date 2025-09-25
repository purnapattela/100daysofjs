const EventEmitter = require("node:events")

class Emitter extends EventEmitter { }

(async () => {
    const myEE = new Emitter({ captureRejections: true })
    /**
     * As we already know captuerRejects works with async events to handle runtime errors. It by default calls 'error' event
     */

    /**
     * LEVEL : 1
     */

    /**
     * event.setMaxListeners(int) is used to set the maximum number of event listeners allowed on the event emitter object.
     * In Nodejs says if more than 10 listners then there are chances of memory leaks.
     */
    myEE.setMaxListeners(10)

    myEE.once("foo", function () {
        console.log("FOO -- ONCE\n")
        console.log(this)
        console.log("\n\n")
    })

    myEE.on("foo", () => {
        console.log("'foo' event occured")
    })

    myEE.on("foo", (data) => {
        console.log("'foo' event occured", data)
    })


    myEE.emit("foo", { someKey: "someValue" })


    /**
     * FACT : events cant return the value
     * If there are listners to a event then the return value is true or else false
     */

    // emit non registeres event - it wont cause any error or program termination
    const res = myEE.emit("not-existed")
    console.log(`Is there are any listning waiting for this event :- ${res}`)

    myEE.on("async", async (data) => {
        console.log(data)
        // throw new Error("Run time exception"); // Automatically called 'error' event cause we decleared a property captureRejection and set it to true
    })

    myEE.on("error", console.error);

    myEE.emit("async", "i-love-node.js")

    // console.clear()
    /**
     * INTERESTING....
     * STORY:
     *  after this code i want to move to next level..
     *  so to get red of previous code i dont want to comment all of the code i written in the top
     *  so i know this method console.clear() i used it
     *  but i got errors. i did some brain-storming session them i got to know the error
     *  just above the console.clear() i called an async event. You know async is not i meediate byt the time it reached Error . i am calling the console.clear() and falling into error
     *  BUT LAST I AM WRONG 😂😂😂. IT's normal behaviour
     *  even chatgpt gave me this saying it is a bug..
     *  The timing and buffering sometimes cause Node to crash or throw unexpected errors because the error handling output is “interrupted” by the console being cleared.
        In some environments or Node versions, this could lead to uncaught exceptions or output confusion.
     * MORAL:
        dont waste time continue learning leave some doubts its better not to touch 😂
     */


    /** 
     * LEVEL : INTERMEDIATE
    */

    myEE.once('newListener', (event, listner) => {
        console.dir({ event, listner })
    })

    myEE.on('test', () => {
        console.log('Testing sucessfull');
    })

    myEE.emit('test')

    myEE.on(EventEmitter.errorMonitor, (err) => {
        console.log(err)
    })

    /**
     * ev.addListener() alias for ev.on()
     * ev.removeListener() alias for ev.off()
     */

    console.log(myEE.eventNames());
    console.log(myEE.getMaxListeners());
    console.log(myEE.listenerCount("foo"))
    myEE.removeAllListeners()
    console.log(`Removed all listeners`)
})()