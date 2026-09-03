import { Question } from '../../types';

export const JAVASCRIPT_QUESTIONS: Question[] = [
  // ==========================================
  // BEGINNER
  // ==========================================
  {
    id: 'js-1',
    stack: 'javascript',
    topic: 'Scope & Hoisting',
    title: 'What are the precise differences between var, let, and const, and what is the Temporal Dead Zone?',
    difficulty: 'Beginner',
    summary: 'var is function-scoped and hoisted with undefined, while let and const are block-scoped and live in the Temporal Dead Zone (TDZ) until initialized.',
    explanation: [
      'Scope: "var" is scoped to the nearest enclosing function (or global object). "let" and "const" are block-scoped, respecting any block delimited by curly braces {}.',
      'Hoisting & TDZ: While all three are hoisted during compile phase, "var" is initialized immediately with "undefined". Variables declared with "let" and "const" enter the Temporal Dead Zone from the start of the block until the declaration line is reached. Accessing them beforehand throws a ReferenceError.',
      'Global Object Property: Global variables declared with "var" become properties of the global window object (window.a). Variables declared with "let" and "const" in global scope do not attach to window.',
      'Reassignment: "var" and "let" can be reassigned. "const" creates an immutable identifier binding; it cannot be reassigned, but properties of an object assigned to const can still be mutated.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'scope-and-hoisting.js',
      code: `console.log(a); // undefined (hoisted & initialized)
// console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)

var a = 10;
let b = 20;
const config = { mode: 'dark' };

config.mode = 'light'; // Allowed: property mutation
// config = {};        // TypeError: Assignment to constant variable

{
  var blockVar = 'leaks out';
  let blockLet = 'stays inside';
}
console.log(blockVar); // 'leaks out'
// console.log(blockLet); // ReferenceError: blockLet is not defined`,
      output: `undefined
leaks out`,
      executionSteps: [
        { line: 1, explanation: 'var a hoisted with undefined; prints undefined without error' },
        { line: 4, explanation: 'var a initialized to 10' },
        { line: 5, explanation: 'let b exits Temporal Dead Zone and initializes to 20' },
        { line: 6, explanation: 'const config binding created in memory' },
        { line: 8, explanation: 'Object property mutation permitted on const object reference' },
        { line: 15, explanation: 'blockVar leaks outside block because var lacks block scope' }
      ]
    },
    keyPoints: [
      'var: Function-scoped, can be redeclared and reassigned, hoisted as undefined, binds to window.',
      'let: Block-scoped, cannot be redeclared in same scope, can be reassigned, TDZ protected.',
      'const: Block-scoped, cannot be redeclared or reassigned, requires immediate initialization.'
    ],
    interviewTip: 'Interviewers often test this using a "for" loop with setTimeout. "var i" shares a single mutable variable printing 3, 3, 3; "let i" binds a fresh lexical scope for every iteration, correctly printing 0, 1, 2.',
    tags: ['ES6', 'Variables', 'TDZ', 'Execution Context', 'InterviewBit']
  },
  {
    id: 'js-2',
    stack: 'javascript',
    topic: 'Data Types & Coercion',
    title: 'Explain JavaScript Primitive vs Reference types, and the difference between "==" and "===".',
    difficulty: 'Beginner',
    summary: 'Primitives are stored directly by value in stack memory, while Reference types store memory pointers to heap objects. "===" checks value and type without coercion.',
    explanation: [
      'Primitives (7 types): string, number, bigint, boolean, undefined, symbol, and null. Stored by value and immutable.',
      'Reference Types: Object, Array, Function, Date, Map, Set. Stored on the heap; variables hold memory addresses (references). Modifying one reference affects all variables referencing that object.',
      'Type Coercion (== vs ===): Strict equality (===) performs no type conversion and returns false if types differ. Loose equality (==) follows the Abstract Equality Comparison Algorithm, coercing operands (e.g. "5" == 5 is true, null == undefined is true, [] == 0 is true).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'types-and-equality.js',
      code: `// 1. Primitive: Copied by Value
let num1 = 10;
let num2 = num1;
num2 = 20;
console.log(num1); // 10 (Original unaffected)

// 2. Reference: Copied by Reference Pointer
let obj1 = { name: 'Dev' };
let obj2 = obj1;
obj2.name = 'Architect';
console.log(obj1.name); // 'Architect' (Mutated!)

// 3. Equality Quirks
console.log(0 == '');        // true (coerced to numbers)
console.log(0 === '');       // false (number !== string)
console.log(null == undefined);  // true
console.log(null === undefined); // false`,
      output: `10
Architect
true
false
true
false`,
      executionSteps: [
        { line: 2, explanation: 'Primitive number 10 allocated by value in memory' },
        { line: 7, explanation: 'Object created in heap memory; obj1 and obj2 share reference pointer' },
        { line: 9, explanation: 'Mutating obj2.name alters shared heap object' },
        { line: 13, explanation: 'Loose equality coerces empty string to 0' },
        { line: 14, explanation: 'Strict equality verifies number !== string' }
      ]
    },
    keyPoints: [
      'Primitive values are immutable and copied by value.',
      'Objects and arrays are reference types copied by memory address.',
      'Always default to strict equality (===) to prevent unexpected type coercion bugs.'
    ],
    interviewTip: 'When asked about typeof null returning "object", explain that this is a legacy bug in the initial JavaScript implementation from 1995 where object type tags were 0 and null was represented as a NULL pointer (0x00).',
    tags: ['Primitives', 'Reference Types', 'Coercion', 'Equality', 'InterviewBit']
  },
  {
    id: 'js-3',
    stack: 'javascript',
    topic: 'Functions & "this"',
    title: 'How do Arrow Functions differ from Regular Functions, especially regarding "this" binding?',
    difficulty: 'Beginner',
    summary: 'Regular functions determine "this" dynamically based on how they are called. Arrow functions do not have their own "this" and capture it lexically from their enclosing scope.',
    explanation: [
      '"this" Binding: In regular functions, "this" depends on caller context (global, object method, or new instance). In arrow functions, "this" is lexically resolved from the surrounding outer scope at definition time.',
      'Arguments Object: Regular functions have an "arguments" array-like object; arrow functions do not (use rest parameters ...args instead).',
      'Constructors: Regular functions can be used with the "new" operator to construct instances. Arrow functions do not have a [[Construct]] internal method or a prototype property and throw a TypeError if called with "new".',
      'Duplicate Parameters: Regular non-strict functions allow duplicate parameter names; arrow functions forbid them.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'arrow-vs-regular-this.js',
      code: `const timer = {
  seconds: 0,
  startRegular: function() {
    setTimeout(function() {
      // Regular function: "this" defaults to global window/undefined in strict mode
      console.log('Regular this.seconds:', this.seconds);
    }, 50);
  },
  startArrow: function() {
    setTimeout(() => {
      // Arrow function: Lexically inherits "this" from startArrow (timer object)
      console.log('Arrow this.seconds:', ++this.seconds);
    }, 50);
  }
};

timer.startRegular(); // Regular this.seconds: undefined
timer.startArrow();   // Arrow this.seconds: 1`,
      output: `Regular this.seconds: undefined
Arrow this.seconds: 1`,
      executionSteps: [
        { line: 3, explanation: 'timer object defined with methods' },
        { line: 5, explanation: 'Regular function callback invoked by browser timer context; "this" lost' },
        { line: 11, explanation: 'Arrow function callback lexically captures timer as "this"' },
        { line: 19, explanation: 'Executes timers; arrow cleanly increments timer.seconds' }
      ]
    },
    keyPoints: [
      'Arrow functions have lexical "this", lexical "arguments", and no "prototype".',
      'Cannot use arrow functions as object methods if you need "this" to refer to that object.',
      'Cannot use arrow functions as constructors with "new".'
    ],
    interviewTip: 'Never define Mongoose methods or Vue/React class methods as arrow functions if you expect "this" to refer to the model or component instance.',
    tags: ['Arrow Functions', 'this', 'ES6', 'Functions', 'InterviewBit']
  },
  {
    id: 'js-9',
    stack: 'javascript',
    topic: 'Type Coercion',
    title: 'Explain Implicit Type Coercion in JavaScript with +, -, Logical Operators, and NaN checks.',
    difficulty: 'Beginner',
    summary: 'Implicit type coercion is the automatic conversion of a value from one type to another during expression evaluation. The "+" operator prefers string concatenation, whereas "-" coerces operands to numbers.',
    explanation: [
      'String Coercion: When the "+" operator has at least one string operand, JavaScript converts all other operands to strings and performs concatenation (e.g. 1 + "2" = "12", "Hello" + 78 = "Hello78").',
      'Numeric Coercion: Arithmetic operators like "-", "*", and "/" convert operands to numbers (e.g. "6" - 2 = 4). If a string cannot be parsed into a valid number, it evaluates to NaN ("A" - 1 = NaN).',
      'Boolean Coercion: Falsy values are false, 0, -0, 0n, "", null, undefined, and NaN. All other values (including [], {}, and "false") are truthy.',
      'Logical Operators Short-Circuiting: Unlike other languages, && and || in JavaScript return the actual operand value, not a boolean: "a" || "b" returns "a"; "a" && "b" returns "b".',
      'NaN Quirks: typeof NaN is "number". NaN is the only value in JavaScript that is not equal to itself (NaN === NaN is false). Use Number.isNaN() to reliably check for NaN.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'implicit-coercion.js',
      code: `// 1. String Coercion with '+'
console.log("1" + 1);             // "11"
console.log(2 + "-2" + "2");       // "2-22"

// 2. Numeric Coercion with '-'
console.log("6" - 2);              // 4
console.log("A" - 1);              // NaN
console.log("Hello" - "World" + 78); // NaN

// 3. Logical Operators return the operand
console.log(220 || "Hello");       // 220 (first truthy)
console.log(0 || "Hello");         // "Hello"
console.log("Hi" && "World");      // "World" (both truthy, returns last)
console.log(null && "World");      // null

// 4. NaN validation
console.log(typeof NaN);           // "number"
console.log(NaN === NaN);          // false
console.log(Number.isNaN("str" - 1)); // true`,
      output: `11
2-22
4
NaN
NaN
220
Hello
World
null
number
false
true`,
      executionSteps: [
        { line: 2, explanation: '"1" + 1 converts 1 to string "1", yielding "11"' },
        { line: 3, explanation: '2 + "-2" becomes "2-2", then + "2" yields "2-22"' },
        { line: 6, explanation: '"6" - 2 converts "6" to number 6, subtracting 2 to give 4' },
        { line: 7, explanation: '"A" cannot be parsed as a number, so numeric conversion produces NaN' },
        { line: 12, explanation: 'OR operator returns first truthy operand (220)' },
        { line: 14, explanation: 'AND operator checks both operands and returns the second truthy value' },
        { line: 19, explanation: 'NaN is of type number and is unique in not equaling itself' }
      ]
    },
    keyPoints: [
      '+ concatenates if any operand is a string; -, *, / always coerce to numbers.',
      '|| returns the first truthy value or the last value; && returns the first falsy value or the last value.',
      'Always use Number.isNaN() rather than global isNaN(), as isNaN("abc") coerces its input to NaN and returns true.'
    ],
    interviewTip: 'InterviewBit classic trap: What is 2 + "-2" + "2"? Answer: "2-22". The evaluation proceeds left-to-right: 2 + "-2" becomes "2-2", and "2-2" + "2" becomes "2-22".',
    tags: ['Coercion', 'Data Types', 'NaN', 'Operators', 'InterviewBit']
  },
  {
    id: 'js-10',
    stack: 'javascript',
    topic: 'Functions & "this"',
    title: 'Explain call(), apply(), and bind() methods: Differences, syntax, and explicit "this" binding.',
    difficulty: 'Beginner',
    summary: 'call() and apply() invoke a function immediately with an explicit "this" context. bind() returns a new function with "this" permanently bound for later execution.',
    explanation: [
      'call(thisArg, arg1, arg2, ...): Invokes the function immediately. Arguments are passed individually as a comma-separated list.',
      'apply(thisArg, [argsArray]): Invokes the function immediately. Arguments are passed as an array (or array-like object). Mnemonic: "A" for Array.',
      'bind(thisArg, arg1, arg2, ...): Does NOT invoke the function immediately. Instead, it returns a new bound function with the specified "this" context and optional preset arguments (currying/partial application).',
      'Function Borrowing: These methods allow an object to borrow methods from another object without copying or inheriting them.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'call-apply-bind.js',
      code: `const car = {
  brand: 'Tesla',
  getDetails: function(year, color) {
    return \`\${this.brand} (\${year}) in \${color}\`;
  }
};

const bike = { brand: 'Ducati' };

// 1. call(): Arguments passed individually
console.log(car.getDetails.call(bike, 2024, 'Red'));
// -> "Ducati (2024) in Red"

// 2. apply(): Arguments passed as an array
console.log(car.getDetails.apply(bike, [2023, 'Matte Black']));
// -> "Ducati (2023) in Matte Black"

// 3. bind(): Returns a reusable function bound to bike
const ducatiDetails = car.getDetails.bind(bike, 2025);
console.log(ducatiDetails('Metallic Blue'));
// -> "Ducati (2025) in Metallic Blue"`,
      output: `Ducati (2024) in Red
Ducati (2023) in Matte Black
Ducati (2025) in Metallic Blue`,
      executionSteps: [
        { line: 1, explanation: 'car object defined with getDetails method referencing this.brand' },
        { line: 8, explanation: 'bike object defined with brand: "Ducati"' },
        { line: 11, explanation: 'call() invokes getDetails with this=bike and comma-separated arguments' },
        { line: 15, explanation: 'apply() invokes getDetails with this=bike and array of arguments' },
        { line: 19, explanation: 'bind() returns a new partially applied function with year fixed to 2025' },
        { line: 20, explanation: 'Invoking bound function supplies remaining color parameter' }
      ]
    },
    keyPoints: [
      'call() and apply() execute immediately; bind() returns a function for later invocation.',
      'call takes comma-separated arguments: fn.call(ctx, 1, 2, 3).',
      'apply takes an array of arguments: fn.apply(ctx, [1, 2, 3]).',
      'bind cannot be overridden by a subsequent call, apply, or bind.'
    ],
    interviewTip: 'Remember the acronym: C for Comma (call), A for Array (apply), B for Beforehand / Bound function (bind).',
    tags: ['call', 'apply', 'bind', 'this', 'InterviewBit']
  },
  {
    id: 'js-11',
    stack: 'javascript',
    topic: 'Functions & Scope',
    title: 'What is an Immediately Invoked Function Expression (IIFE) and why are two sets of parentheses required?',
    difficulty: 'Beginner',
    summary: 'An IIFE is a function expression that executes immediately upon definition. The outer parentheses convert the function into an expression, and the trailing parentheses invoke it.',
    explanation: [
      'Why the first set of parentheses? In JavaScript, when a statement starts with the word "function", the parser expects a function declaration which requires a name. Wrapping it in () tells the engine to treat it as a function expression instead.',
      'Why the second set of parentheses? The second set () immediately invokes the function expression that was just evaluated.',
      'Encapsulation & Scope Isolation: Before ES6 block-scoped let and const, IIFEs were the primary mechanism to create private scopes and prevent variable leakage into the global window object.',
      'Module Pattern: IIFEs form the foundation of the classic JavaScript Module Pattern by returning public interfaces while keeping state enclosed.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'iife-pattern.js',
      code: `// Classic IIFE Syntax
(function() {
  var privateToken = 'secret_xyz_890';
  console.log('IIFE executed immediately!');
})();

// console.log(privateToken); // ReferenceError: privateToken is not defined

// IIFE with arguments and returned public API (Module Pattern)
const counterModule = (function(initialCount) {
  let count = initialCount; // private state

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
})(10);

console.log(counterModule.increment()); // 11
console.log(counterModule.increment()); // 12
console.log(counterModule.getCount());  // 12`,
      output: `IIFE executed immediately!
11
12
12`,
      executionSteps: [
        { line: 2, explanation: 'Outer parentheses (function() { ... }) evaluate function as an expression' },
        { line: 4, explanation: 'Trailing (); immediately invokes the function expression' },
        { line: 5, explanation: 'privateToken is scoped entirely inside IIFE and does not leak globally' },
        { line: 10, explanation: 'counterModule IIFE invoked with argument 10' },
        { line: 14, explanation: 'Returns public object exposing increment, decrement, and getCount' }
      ]
    },
    keyPoints: [
      'IIFE syntax: (function() { /* code */ })(); or (() => { /* code */ })();',
      'Prevents global scope pollution by creating a self-contained execution context.',
      'Forms the foundation of UMD (Universal Module Definition) and jQuery-era plugins.'
    ],
    interviewTip: 'InterviewBit interview question: How does an arrow function IIFE look? Answer: (() => { console.log("Hello"); })();',
    tags: ['IIFE', 'Scope', 'Module Pattern', 'Functions', 'InterviewBit']
  },
  {
    id: 'js-12',
    stack: 'javascript',
    topic: 'ES6 Features',
    title: 'Explain Rest Parameters vs Spread Operator: Syntax, placement rules, and use cases.',
    difficulty: 'Beginner',
    summary: 'Both use three dots (...), but Rest gathers multiple individual arguments into a single array, while Spread unpacks an array or object into individual elements.',
    explanation: [
      'Rest Parameter (...args): Used in function parameter declarations. It collects any remaining arguments into a true JavaScript Array instance (replacing the legacy arguments object). It must ALWAYS be the last parameter in the function signature.',
      'Spread Operator (...iterable): Used in function calls, array literals, and object literals. It expands or spreads elements of an array or properties of an object into distinct values.',
      'Key Difference: Rest condenses multiple elements into one array; Spread expands one array or object into multiple individual elements.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'rest-vs-spread.js',
      code: `// 1. Rest Parameter: Collects arguments into an array
function calculateTotal(discount, ...prices) {
  const sum = prices.reduce((acc, curr) => acc + curr, 0);
  return sum * (1 - discount);
}
console.log(calculateTotal(0.1, 100, 200, 300)); // 540 (sum=600 - 10%)

// 2. Spread Operator: Unpacks array into arguments
const items = [50, 75, 125];
console.log(Math.max(...items)); // 125 (spread into Math.max(50, 75, 125))

// 3. Spread in Object & Array Cloning / Merging
const baseUser = { name: 'Sarah', role: 'Engineer' };
const fullProfile = { ...baseUser, city: 'San Francisco', active: true };
console.log(fullProfile);

const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2, 5];
console.log(combined); // [1, 2, 3, 4, 5]`,
      output: `540
125
{ name: 'Sarah', role: 'Engineer', city: 'San Francisco', active: true }
[ 1, 2, 3, 4, 5 ]`,
      executionSteps: [
        { line: 2, explanation: 'calculateTotal receives discount = 0.1, prices = [100, 200, 300]' },
        { line: 3, explanation: 'prices is a genuine Array with .reduce() and .map() available' },
        { line: 9, explanation: 'Math.max(...items) unpacks items into individual positional arguments' },
        { line: 14, explanation: 'Object spread shallow-clones baseUser properties into new fullProfile object' },
        { line: 19, explanation: 'Array spread merges arr1 and arr2 into a single new array' }
      ]
    },
    keyPoints: [
      'Rest parameter must be the last parameter in a function definition: fn(a, b, ...rest).',
      'Spread creates shallow copies of objects and arrays, not deep copies.',
      'Unlike the arguments object, Rest parameters create a genuine Array with array methods.'
    ],
    interviewTip: 'Common syntax trap: "function test(...a, b)" throws a SyntaxError: Rest parameter must be last formal parameter.',
    tags: ['Rest', 'Spread', 'ES6', 'Arrays', 'InterviewBit']
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: 'js-4',
    stack: 'javascript',
    topic: 'Closures & Lexical Scope',
    title: 'What is a Closure, how does it preserve lexical state, and what is a practical real-world use case?',
    difficulty: 'Intermediate',
    summary: 'A closure is a function bundled with references to its surrounding lexical environment, allowing it to remember outer variables even after the outer function has returned.',
    explanation: [
      'Lexical Scope: Scope is determined statically at code authoring time based on where functions are physically defined.',
      'Closure Mechanics: When an inner function is created inside an outer function, the inner function holds a reference to the outer environment record. When the outer function returns, that variable scope is retained in memory because an active reference persists.',
      'Use Cases: Data privacy (private instance variables), memoization caches, currying, and function factory patterns.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'closure-private-state.js',
      code: `function createBankAccount(initialBalance) {
  // Private variable encapsulated by closure
  let balance = initialBalance;

  return {
    deposit: (amount) => {
      balance += amount;
      return balance;
    },
    withdraw: (amount) => {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance: () => balance
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);       // undefined (Completely private!)`,
      output: `150
undefined`,
      executionSteps: [
        { line: 1, explanation: 'createBankAccount invoked with initialBalance = 100' },
        { line: 3, explanation: 'balance variable stored in lexical environment record' },
        { line: 5, explanation: 'Returns object containing 3 methods enclosing "balance"' },
        { line: 20, explanation: 'Direct access account.balance returns undefined; state is safe' }
      ]
    },
    keyPoints: [
      'Closures give functions access to outer function scope from an inner function.',
      'Closures stay in memory as long as the returned inner function reference is held.',
      'Watch out for memory leaks if closures retain large data structures no longer needed.'
    ],
    interviewTip: 'Mention that modern JavaScript private class fields (#field) now provide native language-level encapsulation alongside closures.',
    tags: ['Closures', 'Lexical Scope', 'Encapsulation', 'Memory', 'InterviewBit']
  },
  {
    id: 'js-5',
    stack: 'javascript',
    topic: 'Event Loop & Concurrency',
    title: 'How does the JavaScript Event Loop work? Explain Call Stack, Web APIs, Microtask Queue, and Macrotask Queue.',
    difficulty: 'Intermediate',
    summary: 'JavaScript is single-threaded. Synchronous code executes on the Call Stack; async tasks offload to Web APIs. The Event Loop prioritizes Microtasks over Macrotasks before every render.',
    explanation: [
      'Call Stack: LIFO stack where execution contexts are pushed and popped as functions execute.',
      'Web APIs / Node APIs: Background threads handling timers, HTTP requests, and DOM events.',
      'Microtask Queue: High-priority queue for Promise callbacks (.then, .catch, .finally), queueMicrotask(), and MutationObserver. Processed until completely empty before any macrotask runs.',
      'Macrotask Queue (Callback Queue): Low-priority queue for setTimeout, setInterval, setImmediate (Node), and I/O callbacks.',
      'Event Loop Cycle: 1) Execute synchronous script on Call Stack. 2) Drain the ENTIRE Microtask queue. 3) Perform UI render paint if needed. 4) Dequeue ONE Macrotask and repeat.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-loop-puzzle.js',
      code: `console.log('1: Synchronous start');

setTimeout(() => {
  console.log('4: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('2: Microtask 1 (Promise)');
}).then(() => {
  console.log('3: Microtask 2 (Chained Promise)');
});

console.log('5: Synchronous end');`,
      output: `1: Synchronous start
5: Synchronous end
2: Microtask 1 (Promise)
3: Microtask 2 (Chained Promise)
4: Macrotask (setTimeout)`,
      executionSteps: [
        { line: 1, explanation: 'Call Stack runs: prints "1: Synchronous start"' },
        { line: 3, explanation: 'setTimeout(0) offloads to Web API; callback enqueued to Macrotask queue' },
        { line: 7, explanation: 'Promise resolves immediately; .then callback enqueued to Microtask queue' },
        { line: 13, explanation: 'Call Stack runs: prints "5: Synchronous end"' },
        { line: 8, explanation: 'Event loop empties Microtasks: prints Microtask 1 & 2' },
        { line: 4, explanation: 'Event loop picks next Macrotask: prints "4: Macrotask"' }
      ]
    },
    keyPoints: [
      'Microtasks ALWAYS preempt Macrotasks.',
      'Starvation risk: An infinite chain of recursive Promise.resolve().then() calls will starve macrotasks and freeze the UI.',
      'UI rendering occurs after the microtask queue is exhausted, before the next macrotask.'
    ],
    interviewTip: 'Interviewers love asking the exact output sequence of mixed setTimeout and Promise code. Walk through the Call Stack -> Microtask -> Macrotask sequence step-by-step.',
    tags: ['Event Loop', 'Microtasks', 'Macrotasks', 'Promises', 'Asynchronous', 'InterviewBit']
  },
  {
    id: 'js-6',
    stack: 'javascript',
    topic: 'Prototypes & Inheritance',
    title: 'Explain the Prototype Chain in JavaScript and how ES6 "class" syntax maps to prototypical inheritance.',
    difficulty: 'Intermediate',
    summary: 'Every JavaScript object has an internal [[Prototype]] link (__proto__). Property lookups traverse this chain until finding the property or reaching null. ES6 classes are syntactic sugar over prototypes.',
    explanation: [
      'Prototype Chain: When accessing obj.prop, JavaScript checks if prop exists on obj. If not, it checks obj.__proto__, then obj.__proto__.__proto__, continuing up to Object.prototype, whose prototype is null.',
      'Function prototype: Functions have a "prototype" property used as the prototype for instances created with "new Func()".',
      'ES6 Classes: "class User {}" is not a new object-oriented model; it is syntactic sugar that configures Function.prototype and prototype methods under the hood.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'prototypes-under-the-hood.js',
      code: `function Person(name) {
  this.name = name;
}

// Attach method to prototype so instances share single function in memory
Person.prototype.greet = function() {
  return \`Hello, my name is \${this.name}\`;
};

const dev = new Person('Alex');

console.log(dev.greet()); // "Hello, my name is Alex"
console.log(dev.hasOwnProperty('name'));  // true (Own property)
console.log(dev.hasOwnProperty('greet')); // false (Inherited via prototype!)
console.log(Object.getPrototypeOf(dev) === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null (End of chain)`,
      output: `Hello, my name is Alex
true
false
true
true
null`,
      executionSteps: [
        { line: 1, explanation: 'Person constructor function defined' },
        { line: 6, explanation: 'greet method attached to Person.prototype memory object' },
        { line: 10, explanation: 'new operator creates object with internal [[Prototype]] pointing to Person.prototype' },
        { line: 12, explanation: 'dev.greet() delegates through prototype chain' },
        { line: 17, explanation: 'Object.prototype.__proto__ terminates at null' }
      ]
    },
    keyPoints: [
      'Methods defined on Function.prototype are shared across all instances, saving significant memory.',
      'Object.create(proto) creates a new object with an explicit prototype link.',
      'Always prefer Object.getPrototypeOf(obj) and Object.setPrototypeOf() over modifying __proto__ directly.'
    ],
    interviewTip: 'Explain that in ES6 classes, methods defined inside the class body are non-enumerable on the prototype, whereas manual prototype assignments are enumerable by default.',
    tags: ['Prototypes', 'Inheritance', 'ES6 Classes', 'OOP', 'InterviewBit']
  },
  {
    id: 'js-13',
    stack: 'javascript',
    topic: 'Currying & Functional Programming',
    title: 'What is Currying in JavaScript? Implement an infinite/flexible currying function.',
    difficulty: 'Intermediate',
    summary: 'Currying transforms a function f(a, b, c) into a series of unary functions f(a)(b)(c). It enables partial application, reusable configuration functions, and clean composition.',
    explanation: [
      'Definition: Currying is a technique where a function that takes multiple arguments is evaluated into a sequence of functions, each taking a single argument.',
      'Benefits: 1) Helps create reusable specialized functions from general ones. 2) Avoids repeatedly passing the same parameters. 3) Integrates seamlessly with function composition pipelines.',
      'Infinite Currying: A classic interview pattern where add(1)(2)(3)...() accumulates values until called with no arguments.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'currying-examples.js',
      code: `// 1. Basic Currying (2 arguments)
function multiply(a, b) {
  return a * b;
}

function curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

const curriedMultiply = curry(multiply);
const double = curriedMultiply(2); // Partial application
console.log(double(5));  // 10
console.log(double(12)); // 24

// 2. Infinite Currying: add(1)(2)(3)(4)()
function infiniteAdd(a) {
  return function(b) {
    if (b !== undefined) {
      return infiniteAdd(a + b);
    }
    return a; // Terminate when called as ()
  };
}

console.log(infiniteAdd(1)(2)(3)(4)()); // 10`,
      output: `10
24
10`,
      executionSteps: [
        { line: 2, explanation: 'multiply function takes two arguments' },
        { line: 6, explanation: 'curry takes fn and returns nested unary functions' },
        { line: 15, explanation: 'curriedMultiply(2) creates specialized "double" function via closure' },
        { line: 17, explanation: 'double(5) evaluates 2 * 5 = 10' },
        { line: 21, explanation: 'infiniteAdd returns inner function that recurses until empty invocation ()' }
      ]
    },
    keyPoints: [
      'Currying breaks n-argument functions into n nested 1-argument functions.',
      'Relies heavily on closures to retain earlier arguments in memory.',
      'Used extensively in libraries like Lodash (curry) and Redux middleware.'
    ],
    interviewTip: 'InterviewBit frequently asks candidates to implement `add(2)(3)` or `sum(1)(2)(3)...()`. Explain the termination condition: either an empty call () or overriding valueOf / Symbol.toPrimitive.',
    tags: ['Currying', 'Functional Programming', 'Closures', 'InterviewBit']
  },
  {
    id: 'js-14',
    stack: 'javascript',
    topic: 'Data Structures',
    title: 'What are WeakMap and WeakSet in JavaScript, and how do they prevent memory leaks compared to Map and Set?',
    difficulty: 'Intermediate',
    summary: 'WeakMap and WeakSet hold weak references to objects, allowing unreferenced objects to be garbage collected automatically without causing memory leaks.',
    explanation: [
      'Weak Reference: In regular Map and Set, storing an object reference prevents the garbage collector (GC) from reclaiming that object, even if all other external references are gone.',
      'Keys Must Be Objects: WeakMap keys and WeakSet elements MUST be objects (or registered symbols in ES2023). Primitives cannot be used because primitives cannot be garbage collected.',
      'No Enumeration: Because garbage collection is non-deterministic, WeakMap and WeakSet are NOT iterable and have no .size property or .keys(), .values(), or .entries() methods.',
      'Supported Methods: WeakMap only supports get(), set(), has(), and delete(). WeakSet only supports add(), has(), and delete().',
      'Use Cases: Caching DOM metadata, private object data, and tracking object visit state without modifying original objects.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'weakmap-weakset.js',
      code: `// 1. WeakSet Example: Tracking active user sessions
const activeSessions = new WeakSet();

let user1 = { id: 101, name: 'Alice' };
let user2 = { id: 102, name: 'Bob' };

activeSessions.add(user1);
activeSessions.add(user2);
console.log(activeSessions.has(user1)); // true

// When user1 is dereferenced, it becomes eligible for Garbage Collection
user1 = null; 
// Memory is reclaimed; activeSessions no longer keeps user1 alive

// 2. WeakMap Example: Associating private metadata with DOM nodes
const clickTracker = new WeakMap();

let button = { id: 'btn-submit', label: 'Submit' };
clickTracker.set(button, { clickCount: 15 });

console.log(clickTracker.get(button)); // { clickCount: 15 }

// If button is removed from DOM:
button = null; // Automatically cleaned up from clickTracker memory!`,
      output: `true
{ clickCount: 15 }`,
      executionSteps: [
        { line: 2, explanation: 'WeakSet initialized; can only contain objects' },
        { line: 7, explanation: 'user1 and user2 added to WeakSet via weak references' },
        { line: 12, explanation: 'Setting user1 = null allows JavaScript GC engine to sweep the object' },
        { line: 16, explanation: 'WeakMap associates metadata with button object' },
        { line: 23, explanation: 'Zero memory leaks occur because WeakMap does not prevent GC' }
      ]
    },
    keyPoints: [
      'Keys of WeakMap and values of WeakSet must be objects.',
      'Objects held weakly are automatically garbage collected when no other strong references exist.',
      'Not iterable: No .size property, no for..of loops, no clear() method.'
    ],
    interviewTip: 'Mention WeakMap as the premier pattern for implementing true private fields in ES5/ES6 prior to the introduction of the native #hash private field syntax.',
    tags: ['WeakMap', 'WeakSet', 'Memory Management', 'Garbage Collection', 'InterviewBit']
  },
  {
    id: 'js-15',
    stack: 'javascript',
    topic: 'Generators & Async Flow',
    title: 'What are Generator Functions in JavaScript? How do function*, yield, and next() work together?',
    difficulty: 'Intermediate',
    summary: 'Generator functions can pause execution midway with "yield" and resume later with "next()", returning an iterator object with { value, done } properties.',
    explanation: [
      'Declaration: Defined using the "function*" syntax. When called, they do NOT execute immediately; they return a Generator Object that adheres to both the Iterable and Iterator protocols.',
      'yield Keyword: Pauses the generator function execution and emits a value to the caller.',
      'next() Method: Resumes execution until the next yield or return statement. Returns an object: { value: Any, done: Boolean }.',
      'Two-way Communication: You can pass values back into the generator by supplying an argument to generator.next(value), which replaces the paused yield expression with that value.',
      'Foundation for Async/Await: Before ES2017 async/await, generators combined with promises (like co library) powered asynchronous coroutines in Node.js.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'generator-functions.js',
      code: `// 1. ID Generator Function
function* idGenerator(start = 1) {
  let id = start;
  while (true) {
    const step = yield id; // Yields id; receives optional step on next()
    id += (step || 1);
  }
}

const gen = idGenerator(100);
console.log(gen.next()); // { value: 100, done: false }
console.log(gen.next()); // { value: 101, done: false }
console.log(gen.next(10)); // { value: 111, done: false } (stepped by 10)

// 2. Finite Iterator Generator
function* range(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}

console.log([...range(1, 4)]); // [1, 2, 3, 4] via spread iteration`,
      output: `{ value: 100, done: false }
{ value: 101, done: false }
{ value: 111, done: false }
[ 1, 2, 3, 4 ]`,
      executionSteps: [
        { line: 2, explanation: 'idGenerator declared with function* syntax' },
        { line: 10, explanation: 'idGenerator(100) returns Generator Object without running body' },
        { line: 11, explanation: 'gen.next() runs to first yield: emits 100, pauses execution' },
        { line: 12, explanation: 'gen.next() resumes, increments id to 101, pauses at next yield' },
        { line: 13, explanation: 'gen.next(10) injects 10 into step variable, jumping id to 111' },
        { line: 23, explanation: 'Spread operator [...range()] drains iterator until done: true' }
      ]
    },
    keyPoints: [
      'Generators are pauseable functions returning { value, done } iterators.',
      'Can generate infinite sequences on demand with O(1) memory consumption.',
      'Calling return() on a generator forces { done: true } and terminates execution.'
    ],
    interviewTip: 'Explain that async/await is effectively an automated generator function driven by a Promise resolution engine (syntactic sugar over generators + promises).',
    tags: ['Generators', 'Iterators', 'yield', 'ES6', 'InterviewBit']
  },
  {
    id: 'js-16',
    stack: 'javascript',
    topic: 'ES6 Features',
    title: 'Explain Object and Array Destructuring: Default values, aliases, nested extraction, and rest properties.',
    difficulty: 'Intermediate',
    summary: 'Destructuring provides a concise syntax to unpack properties from objects or values from arrays into distinct variables, supporting aliases, defaults, and rest elements.',
    explanation: [
      'Object Destructuring: Matches properties by key name: const { name, age } = user. Aliasing allows renaming keys: const { name: userName } = user.',
      'Default Values: Fallbacks can be assigned in case the target property is undefined: const { role = "Viewer" } = user.',
      'Array Destructuring: Matches values by position / index: const [first, second, , fourth] = list. Easily skip elements using commas.',
      'Nested Destructuring: Deep values can be extracted in a single statement: const { address: { city } } = user.',
      'Rest Property: Captures remaining unmatched properties into a new object or array: const { id, ...details } = user.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'destructuring-patterns.js',
      code: `const employee = {
  id: 402,
  profile: {
    fullName: 'David Chen',
    department: 'DevOps'
  },
  skills: ['Docker', 'K8s', 'Terraform', 'Go']
};

// 1. Nested destructuring with aliases & default values
const {
  id: empId, // Aliased to empId
  profile: { fullName, office = 'Remote' }, // Nested + default value
  skills: [primarySkill, secondarySkill, ...otherSkills] // Array destructure + rest
} = employee;

console.log('ID:', empId);
console.log('Name:', fullName);
console.log('Office:', office);
console.log('Primary Skill:', primarySkill);
console.log('Other Skills:', otherSkills);

// 2. Swapping variables without a temporary variable
let a = 1, b = 2;
[a, b] = [b, a];
console.log('Swapped:', a, b); // 2 1`,
      output: `ID: 402
Name: David Chen
Office: Remote
Primary Skill: Docker
Other Skills: [ 'Terraform', 'Go' ]
Swapped: 2 1`,
      executionSteps: [
        { line: 1, explanation: 'employee object with nested profile and skills array declared' },
        { line: 11, explanation: 'Destructures id and renames it to empId' },
        { line: 12, explanation: 'Unpacks nested profile.fullName and provides default for office' },
        { line: 13, explanation: 'Pulls index 0 and 1, gathers remaining skills into otherSkills' },
        { line: 24, explanation: '[a, b] = [b, a] creates tuple and swaps bindings in one step' }
      ]
    },
    keyPoints: [
      'Use colon (:) to rename: { originalKey: newVariableName }.',
      'Use equals (=) for default value: { key = defaultValue }.',
      'Defaults only apply when property value is strictly undefined (not null or false).'
    ],
    interviewTip: 'InterviewBit question: How do you swap two variables without a temporary variable? Answer: [a, b] = [b, a];',
    tags: ['Destructuring', 'ES6', 'Objects', 'Arrays', 'InterviewBit']
  },
  {
    id: 'js-17',
    stack: 'javascript',
    topic: 'Object Methods',
    title: 'How many ways can you create an object in JavaScript, and how do you convert an object into an array?',
    difficulty: 'Intermediate',
    summary: 'Objects can be created via literals, Object.create(), constructors, classes, or factory functions. Objects convert to arrays using Object.keys(), Object.values(), and Object.entries().',
    explanation: [
      'Ways to create an Object (InterviewBit Q36):',
      '1. Object Literal: const obj = { a: 1 }; (Most common, fastest).',
      '2. Object.create(proto): Creates a new object with specified prototype.',
      '3. Constructor Function: new Person("Alice") with PascalCase function and "this".',
      '4. ES6 Class: class Animal {} instantiated with new.',
      '5. Object.assign() or Object constructor: new Object().',
      'Converting Object to Array (InterviewBit Q63):',
      '• Object.keys(obj): Returns array of own enumerable property names [ "id", "name" ].',
      '• Object.values(obj): Returns array of own enumerable property values [ 1, "Alice" ].',
      '• Object.entries(obj): Returns array of key-value tuples [ ["id", 1], ["name", "Alice"] ].'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'object-creation-conversion.js',
      code: `const user = {
  id: 101,
  username: 'coder99',
  role: 'admin',
  verified: true
};

// 1. Converting Object to Arrays (InterviewBit Q63)
const keys = Object.keys(user);
const values = Object.values(user);
const entries = Object.entries(user);

console.log('Keys:', keys);
console.log('Values:', values);
console.log('Entries:', entries);

// 2. Transforming Entries back to an Object
const filtered = Object.fromEntries(
  entries.filter(([key, val]) => typeof val !== 'boolean')
);
console.log('Filtered (No Booleans):', filtered);

// 3. Object.create with custom prototype (InterviewBit Q36)
const proto = { greet() { return 'Hello!'; } };
const customObj = Object.create(proto);
console.log(customObj.greet()); // "Hello!" (Inherited)`,
      output: `Keys: [ 'id', 'username', 'role', 'verified' ]
Values: [ 101, 'coder99', 'admin', true ]
Entries: [ [ 'id', 101 ], [ 'username', 'coder99' ], [ 'role', 'admin' ], [ 'verified', true ] ]
Filtered (No Booleans): { id: 101, username: 'coder99', role: 'admin' }
Hello!`,
      executionSteps: [
        { line: 1, explanation: 'user object defined with multiple primitive properties' },
        { line: 9, explanation: 'Object.keys extracts property names into string array' },
        { line: 10, explanation: 'Object.values extracts property values into array' },
        { line: 11, explanation: 'Object.entries returns 2D array of [key, value] pairs' },
        { line: 18, explanation: 'Object.fromEntries reconstructs an object after filtering entries' },
        { line: 24, explanation: 'Object.create sets up prototype inheritance link' }
      ]
    },
    keyPoints: [
      'Object.entries(obj) is ideal for filtering or mapping over object properties with array methods.',
      'Object.fromEntries(entries) transforms an array of [key, value] pairs back into an object.',
      'Object.create(null) creates a dictionary object with NO prototype (no toString, hasOwnProperty).'
    ],
    interviewTip: 'Object.create(null) is popular for hash map caches because it prevents prototype pollution attacks and has no inherited keys.',
    tags: ['Objects', 'Object.entries', 'Object.create', 'InterviewBit']
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: 'js-7',
    stack: 'javascript',
    topic: 'Performance & Optimization',
    title: 'Implement production-grade Debounce and Throttle functions from scratch, and contrast their use cases.',
    difficulty: 'Advanced',
    summary: 'Debounce delays execution until after a period of inactivity (e.g. search inputs). Throttle limits execution to at most once per specified time interval (e.g. scroll listeners).',
    explanation: [
      'Debounce: Resets its timer every time the event fires. The target function executes only after the user stops triggering events for N milliseconds. Ideal for autocomplete search queries and window resize listeners.',
      'Throttle: Guarantees the target function executes at regular intervals (at most once every N milliseconds), regardless of how many times the user fires the event. Ideal for scroll position tracking, drag-and-drop, and FPS game loops.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'debounce-throttle.js',
      code: `// 1. Debounce Implementation
function debounce(fn, delay) {
  let timerId = null;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 2. Throttle Implementation
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage:
const handleSearch = debounce((text) => console.log('Searching API:', text), 300);
const handleScroll = throttle(() => console.log('Scroll tick'), 100);`,
      output: 'Executes optimized event callbacks without overloading CPU or network',
      executionSteps: [
        { line: 2, explanation: 'debounce captures timerId within outer closure' },
        { line: 5, explanation: 'clearTimeout resets countdown on subsequent rapid keypresses' },
        { line: 14, explanation: 'throttle uses inThrottle flag to gate invocation rate' },
        { line: 19, explanation: 'Unblocks inThrottle lock after interval elapsed' }
      ]
    },
    keyPoints: [
      'Debounce: Clusters multiple events into one single call at the end of the burst.',
      'Throttle: Enforces maximum execution frequency over time.',
      'Always preserve "this" context and forward arguments using fn.apply(this, args).'
    ],
    interviewTip: 'Bonus points for implementing "leading" and "trailing" edge options (like Lodash) where debounce can fire immediately on first click and wait before allowing another.',
    tags: ['Debounce', 'Throttle', 'Performance', 'Closures', 'InterviewBit']
  },
  {
    id: 'js-8',
    stack: 'javascript',
    topic: 'Polyfills & Deep Dive',
    title: 'Implement a complete Polyfill for Array.prototype.reduce and Promise.all from scratch.',
    difficulty: 'Advanced',
    summary: 'Writing polyfills demonstrates mastery of edge cases, array iteration semantics, accumulator initialization, and Promise concurrency tracking.',
    explanation: [
      'Array.prototype.reduce: Iterates an array and reduces it to a single accumulator value. Edge case: If initialValue is not provided, the first element becomes the accumulator, and iteration begins at index 1.',
      'Promise.all: Accepts an iterable of promises and returns a single Promise that resolves with an array of resolved values, or rejects immediately with the reason of the first rejected promise (fail-fast behavior).',
      'Promise concurrency: Must count resolved promises, NOT array index, to ensure all async tasks settle before resolving.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'polyfills.js',
      code: `// Polyfill: Custom Promise.all
function promiseAllPolyfill(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    const results = [];
    let completedCount = 0;

    if (promises.length === 0) return resolve(results);

    promises.forEach((item, index) => {
      // Promise.resolve handles primitives passed into promises array
      Promise.resolve(item)
        .then((val) => {
          results[index] = val; // Preserves original array ordering!
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject); // Fail fast on first error
    });
  });
}

// Test
promiseAllPolyfill([
  Promise.resolve(10),
  Promise.resolve(20),
  30
]).then(console.log); // [10, 20, 30]`,
      output: '[10, 20, 30]',
      executionSteps: [
        { line: 2, explanation: 'Returns new Promise instance wrapping async concurrency' },
        { line: 9, explanation: 'Handles empty array edge case immediately' },
        { line: 13, explanation: 'Promise.resolve wraps non-promise primitive values' },
        { line: 15, explanation: 'Assigns by index to preserve input ordering regardless of resolution speed' },
        { line: 21, explanation: 'Catches first rejection and fails fast' }
      ]
    },
    keyPoints: [
      'Preserve input index ordering in Promise.all even if promise at index 2 resolves before index 0.',
      'Wrap all elements with Promise.resolve() to handle non-Promise values seamlessly.',
      'Always throw TypeError if invalid inputs are passed.'
    ],
    interviewTip: 'Contrast Promise.all (fail-fast) with Promise.allSettled (never rejects, returns status objects: { status: "fulfilled" | "rejected" }).',
    tags: ['Polyfills', 'Promise.all', 'Array.reduce', 'Async', 'InterviewBit']
  },
  {
    id: 'js-18',
    stack: 'javascript',
    topic: 'Tricky Output & Edge Cases',
    title: 'Top 4 Tricky JavaScript Output Questions: Object Key Coercion, Inner Hoisting, and Scope Traps.',
    difficulty: 'Advanced',
    summary: 'Mastering classic interview output puzzles: object key string conversion [object Object], inner function var hoisting shadowing, and setTimeout variable scope.',
    explanation: [
      'Puzzle 1 (Object Key Stringification): Objects used as property keys are automatically coerced via toString(), turning every plain object into the string "[object Object]". Thus x[y] = 1 and x[z] = 2 write to the EXACT SAME property key x["[object Object]"]!',
      'Puzzle 2 (Inner Function Hoisting): In an inner function, declaring "var x = 21" hoists the variable x to the top of that function with undefined. Any operation like x++ before the assignment operates on undefined, resulting in NaN!',
      'Puzzle 3 (setTimeout in Loop): Using "var i" shares one variable across iterations. When the callbacks run 1 second later, the loop has finished and i equals 3, printing 3 three times. Using "let i" creates a fresh lexical binding per iteration, printing 0, 1, 2.',
      'Puzzle 4 (Arrow Function this): Arrow functions do not bind "this". An arrow method inside an object inherits "this" from the parent enclosing execution context (usually the global window), NOT the enclosing object.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'interviewbit-tricky-outputs.js',
      code: `// --- Puzzle 1: Object Keys Coercion (InterviewBit Q54) ---
let x = {}, y = { name: "Ronny" }, z = { name: "John" };
x[y] = { name: "Vivek" }; // x["[object Object]"] = { name: "Vivek" }
x[z] = { name: "Akki" };  // Overwrites x["[object Object]"]!
console.log(x[y]);        // { name: "Akki" }

// --- Puzzle 2: Inner Hoisting Trap (InterviewBit Q55) ---
var val = 23;
(function() {
  var val = 43;
  (function random() {
    val++;               // val is hoisted locally as undefined! undefined + 1 = NaN
    console.log(val);    // NaN
    var val = 21;
  })();
})();

// --- Puzzle 3: Closure & Loop Fix (InterviewBit Q57) ---
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log('let index:', i), 10); // 0, 1, 2 (Correct!)
}`,
      output: `{ name: 'Akki' }
NaN
let index: 0
let index: 1
let index: 2`,
      executionSteps: [
        { line: 2, explanation: 'x[y] evaluates y.toString() -> "[object Object]", setting x["[object Object]"]' },
        { line: 4, explanation: 'x[z] evaluates z.toString() -> "[object Object]", overwriting the same property' },
        { line: 5, explanation: 'x[y] reads x["[object Object]"], returning { name: "Akki" }' },
        { line: 11, explanation: 'Inside random(), var val declaration is hoisted to top as undefined' },
        { line: 12, explanation: 'val++ evaluates undefined + 1 -> NaN' },
        { line: 19, explanation: 'let i binds a new lexical scope for each iteration, preserving 0, 1, 2' }
      ]
    },
    keyPoints: [
      'Object keys in standard objects are ALWAYS coerced to strings (or Symbols). Use Map for object keys.',
      'A local var declaration shadows outer variables from the very first line of the function.',
      'let in a for loop header creates a new lexical environment record for every single iteration.'
    ],
    interviewTip: 'If an interviewer asks: "How can you fix x[y] overwriting x[z]?", answer: "Use ES6 Map (new Map()), which allows actual object references as distinct keys without string coercion."',
    tags: ['Tricky Questions', 'Output Questions', 'Hoisting', 'Coercion', 'InterviewBit']
  },
  {
    id: 'js-19',
    stack: 'javascript',
    topic: 'Performance & Caching',
    title: 'Implement Generic Memoization in JavaScript and optimize expensive function executions.',
    difficulty: 'Advanced',
    summary: 'Memoization caches function outputs based on input arguments using closures. Subsequent calls with identical arguments return the cached result in O(1) time.',
    explanation: [
      'Concept: Memoization is an optimization technique where the return value of an expensive function is cached in an internal dictionary indexed by its serialized arguments.',
      'Closure Mechanism: The cache dictionary is encapsulated within the outer memoize function, remaining private and inaccessible from outside code.',
      'Memory Tradeoff: Memoization trades memory space for execution speed. It is ideal for pure deterministic functions (e.g. recursive Fibonacci, factorial, complex calculations, or regex parsers).',
      'InterviewBit Code Modification (Q57 Code 2): Demonstrates preventing the repeated creation of large arrays on every function call by creating it once and caching it in a closure.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'memoization-utility.js',
      code: `// Generic Memoization Higher-Order Function
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(\`[CACHE HIT] key: \${key}\`);
      return cache.get(key);
    }
    console.log(\`[COMPUTING] key: \${key}\`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive recursive Fibonacci
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log('fib(10):', fibonacci(10)); // Computes in O(n) instead of O(2^n)!
console.log('fib(10) again:', fibonacci(10)); // Instant O(1) Cache Hit!`,
      output: `[COMPUTING] key: [10]
... (cached intermediate subproblems)
fib(10): 55
[CACHE HIT] key: [10]
fib(10) again: 55`,
      executionSteps: [
        { line: 2, explanation: 'memoize creates private Map instance in outer closure' },
        { line: 6, explanation: 'JSON.stringify(args) serializes argument array into unique cache key' },
        { line: 7, explanation: 'Checks cache.has(key); returns cached value immediately if present' },
        { line: 11, explanation: 'Executes original function fn and saves result to cache' },
        { line: 23, explanation: 'Second call to fibonacci(10) bypasses all recursion and returns 55 in O(1)' }
      ]
    },
    keyPoints: [
      'Only pure functions (same input always produces same output, no side effects) can be memoized safely.',
      'JSON.stringify serialization has overhead; for single primitive arguments, a direct Map key is faster.',
      'Consider an LRU (Least Recently Used) cache strategy for memory-sensitive environments.'
    ],
    interviewTip: 'InterviewBit Q25 and Q57 emphasize that memoization trades memory for speed. If arguments vary infinitely, an unbounded cache causes a memory leak.',
    tags: ['Memoization', 'Caching', 'Closures', 'Performance', 'InterviewBit']
  },
  {
    id: 'js-20',
    stack: 'javascript',
    topic: 'Coding Algorithms',
    title: 'Essential JavaScript Coding Interview Problems: Anagram Check, Array Right Rotation, and Binary Search.',
    difficulty: 'Advanced',
    summary: 'Direct solutions for the three core coding problems featured in the InterviewBit guide: string anagram verification, in-place array rotation, and iterative binary search.',
    explanation: [
      '1. Anagram Check (InterviewBit Q61): Two strings are anagrams if they contain the exact same characters in the exact same frequencies. Solved by sanitizing casing, sorting characters, and comparing strings, or via O(n) frequency map.',
      '2. Array Right Rotation by r (InterviewBit Q59): Given an array and rotation count r, each element shifts right. Can be solved using arr.pop() + arr.unshift() or slice-and-concat: arr.slice(-r).concat(arr.slice(0, -r)).',
      '3. Binary Search (InterviewBit Q58): Given a sorted array, repeatedly divide the search interval in half. Calculates middleIndex = Math.floor((low + high) / 2) to achieve O(log n) time complexity.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'interviewbit-coding-challenges.js',
      code: `// Problem 1: Anagram Check (InterviewBit Q61)
function isAnagram(str1, str2) {
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('');
  return normalize(str1) === normalize(str2);
}
console.log('Anagram ("Debit Card", "Bad Credit"):', isAnagram("Debit Card", "Bad Credit")); // true

// Problem 2: Right Rotate Array by r positions (InterviewBit Q59)
function rotateRight(arr, r) {
  const n = arr.length;
  if (n === 0) return arr;
  const k = r % n; // Handle rotations > array length
  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}
console.log('Rotated [2, 3, 4, 5, 7] by 3:', rotateRight([2, 3, 4, 5, 7], 3)); // [4, 5, 7, 2, 3]

// Problem 3: Iterative Binary Search (InterviewBit Q58)
function binarySearch(sortedArr, target) {
  let low = 0, high = sortedArr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArr[mid] === target) return mid; // Found index!
    if (sortedArr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Not found
}
console.log('Binary Search for 42 in [10, 20, 30, 42, 50]: index', binarySearch([10, 20, 30, 42, 50], 42));`,
      output: `Anagram ("Debit Card", "Bad Credit"): true
Rotated [2, 3, 4, 5, 7] by 3: [ 4, 5, 7, 2, 3 ]
Binary Search for 42 in [10, 20, 30, 42, 50]: index 3`,
      executionSteps: [
        { line: 2, explanation: 'isAnagram sanitizes spaces, downcases, sorts characters, and compares' },
        { line: 9, explanation: 'rotateRight computes k = r % n to handle r > length efficiently' },
        { line: 12, explanation: 'Slices trailing k elements and prepends to leading elements in O(n)' },
        { line: 17, explanation: 'binarySearch initializes pointers low = 0 and high = length - 1' },
        { line: 20, explanation: 'Calculates mid index; finds target 42 at index 3 in O(log n)' }
      ]
    },
    keyPoints: [
      'Always normalize strings (lowercase + strip non-alphanumerics) when validating anagrams.',
      'In array rotation, always apply modulo k = r % arr.length to prevent redundant iterations.',
      'Binary search requires the input array to be sorted and runs in O(log n) time and O(1) space.'
    ],
    interviewTip: 'Mention that while array sorting for anagrams runs in O(n log n), an integer frequency counter (hash table) achieves linear O(n) runtime and O(1) auxiliary space (26 characters).',
    tags: ['Algorithms', 'Binary Search', 'Anagrams', 'Arrays', 'InterviewBit']
  }
];
