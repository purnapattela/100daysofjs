const fs = require("node:fs")
/**
 * CONSOLE
 * The node:console module provides a simple debugging console that is similar to the JavaScript console mechanism provided by web browsers.
 */


console.log("Regular console.log() Nothing special")

/**
 * Both Node.js and browser console.log are essentially synchronous in usage (your code won’t continue before the log call returns).
 * The difference is in:
 * 1. Node.js streams: may buffer or flush depending on environment (TTY vs file).
 * 2. Browser DevTools: may defer rendering or show references to objects instead of a snapshot.
 */

/*
 * const console = require("node:console")
 * const { Console } = console;
*/



const consoleModule = require("node:console");
const { Console } = consoleModule;

// Here we created a logger to log to console
// The global console is a special Console whose output is sent to process.stdout and process.stderr. It is equivalent to calling:
const myConsole = new Console(process.stdout, process.stderr);
myConsole.log("Hello from custom console");

// Here we created a logger to file
const SuccessOuput = fs.createWriteStream("./temp/stdout.log")
const ErrorOutput = fs.createWriteStream("./temp/stderr.log")

const fileLogger = new Console({ stdout: SuccessOuput, stderr: ErrorOutput });

fileLogger.log("Success! Everything is acting like working")
fileLogger.warn("Failure! Something is not proper why everything is working in one go..")

console.log("Program ended executing")


// ASSERT(value[, message])
/**
 * Only logs the message if the value is falsy
 * The output always starts with "Assertion failed"
 * If value is truthy, nothing happens.
 */

console.assert(false, "I LOve yOU")

// CLEAR
/**
 * When stdout is a TTY, calling console.clear() will attempt to clear the TTY. When stdout is not a TTY, this method does nothing.
 * In most of the linux it works same but in win it only clears the visible area not the entire terminal sometimes it is just adjusting the text not to show when we scrolle we can get back the text before clearing it
 */
console.clear()

// COUNT(label='default')
console.count()
console.count()

console.countReset()

// console.debug() is an alias of console.log()

console.debug("Hey ! Its really cool")

console.clear()

// DIR(obj[, options])
/**
 * options : {
 *      showHidden : bool,
 *      depth : num,
 *      colors : bool
 * }
 */

let obj = {
    id: 1,
    name: "Todo",
    work: "Hack my mind",
    why: "Funn...",
    depth: 1,
    realUseCase: {
        is_nested: true,
        depth: 2,
        nested: {
            depth: 3
        }
    }
}

console.log(obj)
console.dir(obj, {
    depth: 1,
    colors: false
})

console.clear()

// DIR-XML
/**
 * In Node.js, console.log() and console.dirxml() are almost the same, because Node has no DOM. 
 * dirxml() is only meaningfully different in browsers, where it prints the HTML/XML tree.
 */

console.dirxml(obj)

// ERROR
/**
 * No need to mention much stderr
 */

console.error()

// TABLE(data[, properties])
/**
 * [{},{},[]]
 * properties must be instances of array
 */

let data = [
    {
        id: 1,
        name: "ppc",
        age: 22
    },
    {
        id: 2,
        name: "KLM",
        age: 22
    },
    {
        id: 3,
        name: "MNU",
        age: 21
    }
]

console.table(data, ['name', 'age'])

console.clear()

// TIME - TIMEEND - TIMELOG
console.time('my-timer')
console.timeLog('my-timer')
console.timeLog('my-timer')
console.timeEnd('my-timer')

console.log()


// TRACE
/**
 * Logs to stderr
 * Ususally used to show the stack trace
 */

console.group("1");           // Level 1
console.log("1");             // First item

console.group("tab");         // Level 2
console.log("11");            // Nested
console.groupCollapsed('tab')
console.log("22");            // Nested
console.groupEnd();            // End Level 2

console.log("2");             // Back to Level 1
console.groupEnd();           // End Level 1

console.log("2");             // Back to root

// EXCEP profiling methods i cleared everything..

