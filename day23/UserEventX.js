const { EventX } = require("./EventX.js");


const myEvent = new EventX();

const log = () => console.log("test event logged");
myEvent.on("test", log);

myEvent.emit("test");

console.log(myEvent.listenerCount("test"));
myEvent.off("test", log);
console.log(myEvent.listenerCount("test")); 