import "./style.css"

const appEl = document.getElementById('app');

appEl.innerHTML = `
    <h1>Hello World</h1>
    <p>Javascript is really interesting..</p>
`
console.log('hoistedVar:', hoistedVar);
var hoistedVar = 'I am hoisted!';

var x = 10;
let y = 20;
const z = 30;

function scopeDemo() {
    if (true) {
        var a = 'var scope';
        let b = 'let scope';
        const c = 'const scope';
        console.log('Inside block:', a, b, c);
    }
    console.log('Outside block (var):', a);
}
scopeDemo();

console.log('Start');
setTimeout(() => {
    console.log('Timeout executed');
}, 0);
console.log('End');

const items = [false, 0, -0, 0n, "", null, undefined, NaN, "hello", 1];
items.forEach(item => {
    if (item) {
        console.log('Truthy:', item);
    } else {
        console.log('Falsy:', item);
    }
});

for (let i = 0; i < 3; i++) {
    console.log('For loop:', i);
}

let count = 0;
while (count < 2) {
    console.log('While loop:', count);
    count++;
}

count = 0;
do {
    console.log('Do-while loop:', count);
    count++;
} while (count < 1);

const age = 19;
const status = age >= 18 ? 'adult' : 'minor';
console.log('Ternary:', status);

const language = 'JavaScript';
switch (language) {
    case 'Python':
        console.log('Py rocks!');
        break;
    case 'JavaScript':
        console.log('JS rocks!');
        break;
    default:
        console.log('Something else');
}

console.log('Log message');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');
