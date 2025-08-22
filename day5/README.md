# Day 5 : 100 days of nodejs 

## What I Learned

* How to extend Node.js's built-in `EventEmitter` class.
* How to set a maximum number of listeners with `setMaxListeners()`.
* How to use `errorMonitor` event to listen for errors without affecting default error handling.
* The purpose of `captureRejections: true` to automatically handle promise rejections in event handlers.
* How to emit and listen for custom events.
* How to emit and handle errors properly using the `"error"` event.
* How to add and remove event listeners using `.on()` and `.off()`.
* How to use `.listenerCount()` and `.listeners()` to inspect event listeners.
* How removing all listeners with `.removeAllListeners()` works.
* How emitting an event with no listeners behaves.
* The difference between `errorMonitor` and `error` events.
* Understanding event listener warnings when exceeding max listeners.
* Practical use of try-catch inside event handlers and when it’s not needed because of `captureRejections`.
