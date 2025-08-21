console.log('Node.js version:', process.version);

console.log('Platform:', process.platform);


if (typeof window === 'undefined') {
    console.log('Running in Node.js!');
} else {
    console.log('Running in the browser!');
}


function regularFunc(msg) {
    return `regular: ${msg}`;
}

const arrowFunc = msg => `arrow: ${msg}`;

const asyncFunc = async msg => {
    return `async: ${await Promise.resolve(msg)}`;
};


console.log(regularFunc('hello'));

console.log(arrowFunc('hi there'));

asyncFunc('async hello').then(console.log);


const path = require('path');
const os = require('os');


console.log('Current directory name:', path.basename(__dirname));

console.log('User home directory:', os.homedir());

