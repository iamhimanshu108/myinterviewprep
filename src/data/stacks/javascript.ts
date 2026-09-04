import { Question } from '../../types';

export const JAVASCRIPT_QUESTIONS: Question[] = [
  // ==========================================
  // Topic 1: Data Types, Coercion & Memory Management
  // ==========================================
  {
    id: 'js-1',
    stack: 'javascript',
    topic: 'Data Types, Coercion & Memory Management',
    title: 'What are the primitive and non-primitive data types in JavaScript?',
    difficulty: 'Beginner',
    summary: 'Primitives are stored directly by value and are immutable: String, Number, BigInt, Boolean, Undefined, Null, and Symbol. Non-Primitives are stored by reference: Object (including Arrays, Functions, and Dates). Note: typeof null returns "object" due to a legacy bug in JavaScript engines.',
    explanation: [
      'Primitives (7 types): String, Number, BigInt, Boolean, Undefined, Null, and Symbol. They are immutable and stored directly by value in stack memory.',
      'Non-Primitives: Object, Array, Function, Date, Map, Set, RegExp. They are mutable and stored in heap memory; variables store only the memory reference pointer.',
      'typeof null quirk: In early JavaScript implementations, values were stored with type tags (objects had tag 0, null was NULL pointer 0x00), which causes typeof null to return "object".',
      'Mutability: Modifying a primitive variable creates a new value in memory, whereas mutating a non-primitive updates the shared heap object directly.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'primitives-vs-nonprimitives.js',
      code: `// 1. Primitives (Stored by value & immutable)
let str = "hello";
let num = 42;
let bool = true;
let n = null;
let u = undefined;
let sym = Symbol("id");
let big = 9007199254740991n;

console.log(typeof str);  // "string"
console.log(typeof num);  // "number"
console.log(typeof null); // "object" (legacy engine bug)

// 2. Non-Primitives (Stored by reference pointer)
let obj = { name: "Alice" };
let arr = [1, 2, 3];
console.log(typeof obj);  // "object"
console.log(Array.isArray(arr)); // true`,
      output: `string
number
object
object
true`,
      executionSteps: [
        { line: 2, explanation: 'Primitive string "hello" allocated by value' },
        { line: 11, explanation: 'typeof null evaluated: returns "object" due to historic type-tag bug' },
        { line: 15, explanation: 'Object allocated in heap; obj holds memory reference' },
        { line: 18, explanation: 'Array.isArray confirms array instance type' }
      ]
    },
    keyPoints: [
      '7 Primitive types: string, number, bigint, boolean, undefined, null, symbol.',
      'Non-primitives: objects, arrays, and functions stored by reference in heap memory.',
      'typeof null === "object" is an unfixable legacy bug in the ECMAScript spec.'
    ],
    interviewTip: 'Always use Array.isArray(val) or Object.prototype.toString.call(val) instead of typeof when distinguishing arrays or null from generic objects.',
    tags: ['Primitives', 'Data Types', 'Memory', 'typeof', 'JavaScript Basics']
  },
  {
    id: 'js-2',
    stack: 'javascript',
    topic: 'Data Types, Coercion & Memory Management',
    title: 'Is JavaScript statically typed or dynamically typed?',
    difficulty: 'Beginner',
    summary: 'JavaScript is dynamically typed. Types are bound to values rather than variable declarations, and type checking occurs at runtime.',
    explanation: [
      'Dynamic Typing: Variables do not hold type declarations. The JavaScript engine determines the type at runtime based on the value currently assigned.',
      'Reassignment: A variable declared with let or var can hold a number, then be reassigned to a string, object, or boolean during execution.',
      'Runtime vs Compile-time: Statically typed languages (TypeScript, Java, C++) check types during compilation, catching errors early. JavaScript catches type errors (e.g., calling non-functions) during runtime.',
      'Weakly Typed: JavaScript also allows implicit coercion between unrelated types during operations (e.g., "5" - 1).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'dynamic-typing.js',
      code: `let data = 42; // Currently a number
console.log(typeof data); // "number"

data = "Interview Prep"; // Reassigned to a string
console.log(typeof data); // "string"

data = { id: 101, active: true }; // Reassigned to an object
console.log(typeof data); // "object"`,
      output: `number
string
object`,
      executionSteps: [
        { line: 1, explanation: 'Variable data initialized with number 42' },
        { line: 4, explanation: 'Variable data dynamically re-bound to string literal' },
        { line: 7, explanation: 'Variable data re-bound to object reference' }
      ]
    },
    keyPoints: [
      'Types belong to values, not variable bindings.',
      'Type verification occurs entirely at runtime, not during compile time.',
      'Provides high flexibility, but requires runtime validation or TypeScript for enterprise safety.'
    ],
    interviewTip: 'Mention that while JavaScript is dynamically typed, tools like TypeScript add compile-time static type checking on top of JS.',
    tags: ['Typing', 'Runtime', 'Basics', 'Dynamic Typing']
  },
  {
    id: 'js-3',
    stack: 'javascript',
    topic: 'Data Types, Coercion & Memory Management',
    title: 'Explain Implicit Type Coercion.',
    difficulty: 'Beginner',
    summary: 'Automatic conversion of values between data types during operations. The binary + operator coerces operands to strings if any operand is a string (e.g., "5" + 2 evaluates to "52"). Arithmetic operators like -, *, and / coerce string values to numbers (e.g., "5" - 2 evaluates to 3).',
    explanation: [
      'String Coercion with +: If either operand is a string, JavaScript converts the other operand to a string and performs concatenation ("5" + 2 = "52").',
      'Numeric Coercion with Arithmetic Operators: Operators like -, *, /, and % only make sense mathematically, so JavaScript coerces string values to numbers ("5" - 2 = 3). If conversion fails, NaN is returned.',
      'Boolean Coercion: Logical contexts (if statements, !, ||, &&) automatically coerce values to booleans (falsy values: 0, "", null, undefined, NaN, false).',
      'Object to Primitive: Objects are coerced using their [Symbol.toPrimitive], valueOf(), or toString() methods.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'implicit-coercion.js',
      code: `// String coercion with binary +
console.log("5" + 2);     // "52"
console.log("5" + true);  // "5true"

// Numeric coercion with arithmetic operators
console.log("5" - 2);     // 3
console.log("6" * "2");   // 12
console.log("10" / "2");  // 5

// Boolean coercion
console.log(!0);          // true
console.log(Boolean("")); // false`,
      output: `52
5true
3
12
5
true
false`,
      executionSteps: [
        { line: 2, explanation: 'Binary + sees string operand "5", coerces 2 to "2", concatenating to "52"' },
        { line: 6, explanation: 'Minus operator coerces string "5" to number 5, resulting in 3' },
        { line: 11, explanation: '0 is falsy, !0 coerces to true' }
      ]
    },
    keyPoints: [
      '+ favors string concatenation if at least one operand is a string.',
      '-, *, /, % coerce operands to numbers.',
      'Falsy values: 0, -0, 0n, "", null, undefined, NaN, false.'
    ],
    interviewTip: 'A popular question is console.log([] + []). Both arrays coerce to empty strings (""), returning ""!',
    tags: ['Coercion', 'Operators', 'Type Conversion', 'Beginner']
  },
  {
    id: 'js-4',
    stack: 'javascript',
    topic: 'Data Types, Coercion & Memory Management',
    title: 'What is the difference between == and ===?',
    difficulty: 'Beginner',
    summary: '== (Loose Equality) compares values after applying implicit type coercion. === (Strict Equality) compares both value and data type without conversion.',
    explanation: [
      'Loose Equality (==): Converts operands to common types before comparing following ECMAScript Abstract Equality algorithm. E.g., 5 == "5" is true, 0 == false is true.',
      'Strict Equality (===): Checks both value and type without coercion. If types differ, it returns false immediately.',
      'Null and Undefined: null == undefined is true, but null === undefined is false.',
      'Object Comparison: Both == and === check reference pointers when comparing objects, not properties.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'equality-comparison.js',
      code: `// Loose equality (==) coerces types
console.log(5 == "5");           // true
console.log(0 == false);         // true
console.log(null == undefined);  // true

// Strict equality (===) checks value and type
console.log(5 === "5");          // false
console.log(0 === false);        // false
console.log(null === undefined); // false

// Objects compared by reference
console.log([] == []);           // false (distinct memory pointers)
console.log({} === {});          // false`,
      output: `true
true
true
false
false
false
false
false`,
      executionSteps: [
        { line: 2, explanation: '== coerces string "5" to number 5, evaluating to true' },
        { line: 7, explanation: '=== verifies type: number !== string, evaluating to false' },
        { line: 12, explanation: 'Empty arrays have unique heap memory pointers, evaluating to false' }
      ]
    },
    keyPoints: [
      '== permits type coercion before comparing.',
      '=== verifies both type and value without coercion.',
      'Always prefer === to avoid subtle bugs in production.'
    ],
    interviewTip: 'Remember that NaN === NaN is false! Use Number.isNaN(x) or Object.is(NaN, NaN) to check NaN.',
    tags: ['Equality', 'Coercion', 'Best Practices', 'Comparison']
  },
  {
    id: 'js-5',
    stack: 'javascript',
    topic: 'Data Types, Coercion & Memory Management',
    title: 'What is NaN, and how does isNaN() differ from Number.isNaN()?',
    difficulty: 'Intermediate',
    summary: 'NaN ("Not-a-Number") represents an invalid mathematical operation; typeof NaN is "number". isNaN(value) coerces the argument to a number first before checking. Number.isNaN(value) strictly checks if the passed value is of type Number and evaluates to NaN without type coercion.',
    explanation: [
      'What is NaN: NaN is a special numeric value produced when a mathematical operation yields an undefined or unrepresentable result (e.g., 0 / 0 or Math.sqrt(-1)).',
      'typeof NaN: Returns "number" because it is an IEEE 754 floating-point standard representation.',
      'Global isNaN(): Converts the argument to a number first. Hence, isNaN("hello") is true because Number("hello") is NaN.',
      'Number.isNaN(): Introduced in ES6, it does NOT coerce. It returns true if and only if the argument is actually of type number AND its value is NaN.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'nan-comparison.js',
      code: `console.log(typeof NaN); // "number"
console.log(NaN === NaN); // false (NaN is never equal to itself)

// Global isNaN() coerces to number first:
console.log(isNaN("hello")); // true (Number("hello") is NaN)
console.log(isNaN("123"));   // false (Number("123") is 123)

// Number.isNaN() strictly checks without coercion:
console.log(Number.isNaN("hello")); // false (type is string, not NaN)
console.log(Number.isNaN(0 / 0));   // true (result of 0/0 is NaN)`,
      output: `number
false
true
false
false
true`,
      executionSteps: [
        { line: 1, explanation: 'typeof NaN returns "number" according to IEEE 754 spec' },
        { line: 2, explanation: 'NaN is unique in that it never equals itself' },
        { line: 5, explanation: 'isNaN("hello") coerces "hello" to NaN, returning true' },
        { line: 9, explanation: 'Number.isNaN("hello") checks type without coercion, returning false' }
      ]
    },
    keyPoints: [
      'typeof NaN is "number".',
      'NaN is the only value in JavaScript not equal to itself (NaN !== NaN).',
      'Number.isNaN() is safe and does not perform implicit type coercion.'
    ],
    interviewTip: 'To check if a value is strictly NaN without Number.isNaN, you can test value !== value.',
    tags: ['NaN', 'Numbers', 'Type Checking', 'ES6']
  },
  {
    id: 'js-6',
    stack: 'javascript',
    topic: 'Data Types, Coercion & Memory Management',
    title: 'Is JavaScript pass-by-value or pass-by-reference?',
    difficulty: 'Intermediate',
    summary: 'Strictly pass-by-value. For objects and arrays, the value that is passed into a function is the memory reference itself. Mutating an object property reflects outside, but reassigning the parameter variable does not break the original reference outside.',
    explanation: [
      'Call-by-sharing / Pass-by-value: In JavaScript, everything is passed by value.',
      'Primitives: The value itself is copied. Changes inside the function do not affect the outer variable.',
      'Objects and Arrays: The value passed is the memory address pointer. When you mutate a property (obj.name = "X"), the shared object is modified.',
      'Reassignment: If you reassign the parameter (obj = { ... }), you only overwrite the local copy of the pointer. The external reference remains pointing to the original object.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'pass-by-value.js',
      code: `function modify(obj, primitive) {
  primitive = 100;         // Local copy, caller unaffected
  obj.name = "Mutated";     // Mutates object via shared reference
  obj = { name: "NewObj" }; // Reassigning local pointer does NOT affect outer user!
}

let num = 10;
let user = { name: "Original" };

modify(user, num);

console.log(num);       // 10 (unchanged)
console.log(user.name); // "Mutated" (property mutated via shared reference)`,
      output: `10
Mutated`,
      executionSteps: [
        { line: 9, explanation: 'Primitive number 10 and object reference created' },
        { line: 11, explanation: 'modify called; copies primitive value 10 and copies reference pointer of user' },
        { line: 3, explanation: 'obj.name modified through reference; visible outside' },
        { line: 4, explanation: 'obj reassigned to new object; outer user reference remains unchanged' }
      ]
    },
    keyPoints: [
      'JavaScript is strictly pass-by-value at all times.',
      'For objects, the reference pointer is passed as the value.',
      'Mutating properties affects the original; reassigning the parameter does not.'
    ],
    interviewTip: 'Use this question to explain why shallow copies or deep copies are necessary when modifying nested state in React.',
    tags: ['Memory', 'Pass by Value', 'References', 'Execution Context']
  },

  // ==========================================
  // Topic 2: Variable Declarations, Scoping & Hoisting
  // ==========================================
  {
    id: 'js-7',
    stack: 'javascript',
    topic: 'Variable Declarations, Scoping & Hoisting',
    title: 'Differences between var, let, and const',
    difficulty: 'Beginner',
    summary: 'var: Function-scoped, hoisted to the top initialized as undefined, allows re-declaration and re-assignment. let: Block-scoped ({}), hoisted into the Temporal Dead Zone (TDZ) uninitialized, allows re-assignment but forbids re-declaration in the same scope. const: Block-scoped, hoisted into the TDZ, forbids both re-assignment and re-declaration.',
    explanation: [
      'Scope: var is function-scoped (or global if outside any function). let and const are strictly block-scoped within {}.',
      'Hoisting: var is hoisted and initialized with undefined. let and const are hoisted but remain uninitialized in the TDZ until execution reaches the declaration.',
      'Re-declaration: var allows declaring the same identifier multiple times in one scope. let and const throw a SyntaxError.',
      'Re-assignment: var and let can be reassigned. const creates an immutable identifier binding, though object properties can still be mutated.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'var-let-const.js',
      code: `// var: function-scoped, leaks out of block
if (true) {
  var a = 10;
  let b = 20;
  const c = 30;
}
console.log(a); // 10
// console.log(b); // ReferenceError: b is not defined
// console.log(c); // ReferenceError: c is not defined

// const binding is immutable, but properties can mutate
const obj = { x: 1 };
obj.x = 2; // Allowed: mutating object property
// obj = {}; // TypeError: Assignment to constant variable`,
      output: `10`,
      executionSteps: [
        { line: 3, explanation: 'var a hoisted to enclosing function or global scope' },
        { line: 4, explanation: 'let b scoped strictly to the if block' },
        { line: 8, explanation: 'console.log(a) prints 10 because var leaks outside block' }
      ]
    },
    keyPoints: [
      'var: Function-scoped, hoisted as undefined, binds to window.',
      'let: Block-scoped, re-assignable, TDZ protected.',
      'const: Block-scoped, constant binding (non-reassignable), TDZ protected.'
    ],
    interviewTip: 'Highlight that const protects the variable binding, NOT the contents of arrays or objects. Use Object.freeze() for object immutability.',
    tags: ['var', 'let', 'const', 'Scope', 'TDZ']
  },
  {
    id: 'js-8',
    stack: 'javascript',
    topic: 'Variable Declarations, Scoping & Hoisting',
    title: 'Explain Hoisting in JavaScript.',
    difficulty: 'Beginner',
    summary: 'The engine scans declarations during compilation and allocates memory for them before executing code. Function declarations are hoisted completely with definitions intact. Variable declarations with var are initialized as undefined.',
    explanation: [
      'Compilation Phase: Before executing JavaScript line by line, the V8 engine compiles code into bytecode, registering variable and function declarations in lexical memory.',
      'Function Declarations: Hoisted with their full implementation, so they can be invoked anywhere in their scope before their textual declaration.',
      'var Declarations: Memory is allocated and initialized to undefined immediately.',
      'let & const Declarations: Hoisted into the environment record but remain uninitialized until their declaration statement is evaluated.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'hoisting-mechanism.js',
      code: `console.log(greet()); // "Hello!" (Function declaration hoisted completely)
function greet() {
  return "Hello!";
}

console.log(x); // undefined (var hoisted, initialized as undefined)
var x = 5;

// Function expressions are NOT hoisted as functions:
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { return "Hi!"; };`,
      output: `Hello!
undefined`,
      executionSteps: [
        { line: 1, explanation: 'greet() executed successfully due to full function hoisting' },
        { line: 6, explanation: 'console.log(x) outputs undefined because var x is hoisted with undefined' },
        { line: 7, explanation: 'x assigned value 5' }
      ]
    },
    keyPoints: [
      'Hoisting is a compile-time memory allocation phase.',
      'Function declarations are hoisted with their body.',
      'Function expressions (assigned to var or let) are not hoisted as functions.'
    ],
    interviewTip: 'Arrow functions assigned to variables behave like variable declarations, not function declarations.',
    tags: ['Hoisting', 'Execution Context', 'Compilation', 'Functions']
  },
  {
    id: 'js-9',
    stack: 'javascript',
    topic: 'Variable Declarations, Scoping & Hoisting',
    title: 'What is the Temporal Dead Zone (TDZ)?',
    difficulty: 'Intermediate',
    summary: 'The phase between entering a block scope and the line where a let or const variable is declared and initialized. Accessing the identifier in this state throws a ReferenceError.',
    explanation: [
      'Temporal Span: TDZ is temporal (time-based) rather than purely positional. It represents the time window from scope entry to initialization.',
      'ReferenceError: Unlike var which returns undefined, accessing a let or const variable in its TDZ throws: ReferenceError: Cannot access variable before initialization.',
      'typeof Check: In the TDZ, even typeof myVar throws a ReferenceError. (typeof on undeclared variables returns "undefined").',
      'Purpose: Designed in ES6 to prevent accessing variables before their intended definition, reducing subtle bugs.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'temporal-dead-zone.js',
      code: `{
  // TDZ for myVar starts here at scope entrance
  // console.log(myVar); // ReferenceError: Cannot access 'myVar' before initialization
  
  let irrelevant = 10;
  // TDZ continues...
  
  let myVar = 42; // TDZ ends here for myVar!
  console.log(myVar); // 42
}`,
      output: `42`,
      executionSteps: [
        { line: 1, explanation: 'Block scope entered; myVar enters TDZ uninitialized' },
        { line: 7, explanation: 'let myVar = 42 reached; myVar exits TDZ' },
        { line: 8, explanation: 'console.log(myVar) prints 42 safely' }
      ]
    },
    keyPoints: [
      'TDZ is active from block entry until the variable declaration line executes.',
      'Accessing variables in TDZ throws a ReferenceError.',
      'let, const, and class declarations are all subject to the TDZ.'
    ],
    interviewTip: 'A common trick: function foo(x = y, y = 2) { return [x, y]; } Calling foo() throws ReferenceError because y is in TDZ when default parameter x evaluates!',
    tags: ['TDZ', 'ES6', 'let', 'const', 'Scope']
  },
  {
    id: 'js-10',
    stack: 'javascript',
    topic: 'Variable Declarations, Scoping & Hoisting',
    title: 'What is Scope and the Scope Chain?',
    difficulty: 'Beginner',
    summary: 'Scope defines the accessibility boundaries of variables (Global, Function, Block). The Scope Chain is the resolution lookup mechanism: if a variable is not found in the local execution context, the engine searches outer lexical environments until reaching the global scope.',
    explanation: [
      'Global Scope: Variables defined outside any function or block, accessible anywhere in the application.',
      'Function Scope: Variables declared with var, let, or const inside a function are private to that function.',
      'Block Scope: Variables declared with let and const inside curly braces {} are accessible only within that block.',
      'Scope Chain: Every execution context has a reference to its outer lexical environment. When an identifier is referenced, the engine traverses upward along the scope chain. If not found in global scope, a ReferenceError is thrown.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'scope-chain.js',
      code: `const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    // Resolves innerVar locally, outerVar from parent, globalVar from global scope
    console.log(\`\${innerVar} -> \${outerVar} -> \${globalVar}\`);
  }
  inner();
}
outer();`,
      output: `inner -> outer -> global`,
      executionSteps: [
        { line: 1, explanation: 'globalVar declared in global lexical environment' },
        { line: 3, explanation: 'outer() invoked; creates outer execution context' },
        { line: 6, explanation: 'inner() invoked; creates inner execution context linked to outer' },
        { line: 9, explanation: 'Variables resolved via lexical Scope Chain' }
      ]
    },
    keyPoints: [
      'Lexical Scoping: JavaScript scopes are determined by where functions are written in the source code.',
      'Lookup is one-way: inner scopes can access outer variables, but outer scopes cannot access inner variables.',
      'Failing to find a variable across the entire chain results in a ReferenceError.'
    ],
    interviewTip: 'Emphasize that JavaScript uses LEXICAL scoping (static scoping), meaning scope is determined at author time, not call time.',
    tags: ['Scope', 'Scope Chain', 'Lexical Environment', 'Basics']
  },
  {
    id: 'js-11',
    stack: 'javascript',
    topic: 'Variable Declarations, Scoping & Hoisting',
    title: 'What is JavaScript Strict Mode?',
    difficulty: 'Beginner',
    summary: 'Activated with "use strict"; at the top of a script or function. Throws errors on silent bugs, disallows undeclared variables, prevents duplicate function parameter names, and leaves this as undefined in standalone functions.',
    explanation: [
      'Enabling Strict Mode: Placed at the top of a file or function body via "use strict";. ES6 modules and classes enable strict mode automatically.',
      'Prevents Accidental Globals: Assigning to an undeclared variable throws a ReferenceError instead of creating a global variable on window.',
      'Eliminates Silent Errors: Assigning to non-writable properties or deleting undeletable properties throws TypeErrors.',
      'Standalone this Binding: In regular mode, this in standalone functions defaults to window/global. In strict mode, this remains undefined.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'strict-mode.js',
      code: `"use strict";

// 1. Undeclared variable assignment throws ReferenceError
// x = 10; // ReferenceError: x is not defined

// 2. Standalone function 'this' is undefined instead of window
function checkThis() {
  return this;
}
console.log(checkThis()); // undefined`,
      output: `undefined`,
      executionSteps: [
        { line: 1, explanation: '"use strict" enables ECMAScript strict mode' },
        { line: 7, explanation: 'Standalone function executed without context' },
        { line: 10, explanation: 'this evaluates to undefined instead of window' }
      ]
    },
    keyPoints: [
      'Enforces cleaner code and throws errors on previously silent failures.',
      'Prevents implicit global variable creation.',
      'Sets this to undefined in standalone function calls.',
      'Automatically enabled in ES6 modules and classes.'
    ],
    interviewTip: 'Mention that modern bundlers and ES Modules enable strict mode by default, so explicit "use strict" is rarely needed in modern frameworks.',
    tags: ['Strict Mode', 'Error Handling', 'Best Practices']
  },

  // ==========================================
  // Topic 3: Functions, 'this' Context & Closures
  // ==========================================
  {
    id: 'js-12',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'What is an IIFE (Immediately Invoked Function Expression)?',
    difficulty: 'Beginner',
    summary: 'A function that executes immediately after definition. Used to prevent variables from polluting the global scope.',
    explanation: [
      'Syntax: Wrapped in grouping parentheses (function() { ... })() to turn a function declaration into an expression, followed by invocation parentheses ().',
      'Scope Isolation: Variables declared with var inside an IIFE remain private to the function and do not leak to window or global scope.',
      'Pre-ES6 Module Pattern: Before ES6 let/const and modules (import/export), IIFEs were the primary mechanism for encapsulating private state in libraries (e.g., jQuery).',
      'Return Value: An IIFE can return objects containing public methods while keeping inner helper variables private.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'iife-pattern.js',
      code: `(function() {
  var privateKey = "secure_token";
  console.log("IIFE executed, privateKey protected:", privateKey);
})();

// console.log(privateKey); // ReferenceError: privateKey is not defined`,
      output: `IIFE executed, privateKey protected: secure_token`,
      executionSteps: [
        { line: 1, explanation: 'Function expression evaluated and invoked immediately' },
        { line: 2, explanation: 'privateKey allocated inside isolated function scope' },
        { line: 3, explanation: 'Prints message safely from within the IIFE' }
      ]
    },
    keyPoints: [
      'Executes immediately upon definition.',
      'Prevents global namespace pollution.',
      'Foundation of the classic JavaScript module pattern.'
    ],
    interviewTip: 'Explain that with ES6 block scoping ({ let x = 1; }) and ES Modules, the necessity for IIFEs has decreased, though they remain useful in asynchronous self-executing code.',
    tags: ['IIFE', 'Functions', 'Encapsulation', 'Scope']
  },
  {
    id: 'js-13',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'What are Higher-Order Functions?',
    difficulty: 'Beginner',
    summary: 'Functions that accept other functions as arguments (callbacks) or return a function as their result (e.g., map(), filter(), reduce()).',
    explanation: [
      'First-Class Citizens: In JavaScript, functions are first-class objects—they can be assigned to variables, passed into arguments, and returned from functions.',
      'Accepting Callbacks: Methods like Array.prototype.map, filter, reduce, and forEach are higher-order functions because they receive callback functions.',
      'Returning Functions: Higher-order functions can create specialized functions (factories, currying, decorators, or middleware).',
      'Declarative Code: Enables functional programming paradigms, improving readability and testability.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'higher-order-functions.js',
      code: `// 1. Accepting a callback
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]

// 2. Returning a function (function factory)
function multiplier(factor) {
  return num => num * factor;
}
const triple = multiplier(3);
console.log(triple(5)); // 15`,
      output: `[ 2, 4, 6, 8 ]
15`,
      executionSteps: [
        { line: 3, explanation: 'Array.map takes n => n * 2 callback and executes for each item' },
        { line: 7, explanation: 'multiplier returns a new closure function capturing factor' },
        { line: 11, explanation: 'triple(5) invokes returned function: 5 * 3 = 15' }
      ]
    },
    keyPoints: [
      'Takes one or more functions as arguments, or returns a function.',
      'Central to functional programming in JavaScript.',
      'Standard array methods (map, filter, reduce) are built-in higher-order functions.'
    ],
    interviewTip: 'Connect higher-order functions to React Higher-Order Components (HOCs) or custom React hooks.',
    tags: ['Higher-Order Functions', 'Functional Programming', 'Callbacks']
  },
  {
    id: 'js-14',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'Explain Closures with a use case.',
    difficulty: 'Intermediate',
    summary: 'A closure is created when an inner function maintains access to its outer lexical scope variables even after the outer function has finished executing. Ideal for data privacy.',
    explanation: [
      'How Closures Work: When an outer function executes, its variables reside in memory. If an inner function references them and is returned, JavaScript preserves that lexical environment on the heap.',
      'Data Privacy: Closures allow emulating private variables that cannot be altered or accessed directly from outside code.',
      'Stateful Functions: Used in memoization, function factories, debouncing, and React hooks (useState).',
      'Garbage Collection: Variables captured in closures are kept alive as long as the returned inner function remains referenced.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'closure-wallet.js',
      code: `function makeWallet() {
  let balance = 0; // Private variable encapsulated by closure
  return {
    add: amt => balance += amt,
    get: () => balance
  };
}

const wallet = makeWallet();
wallet.add(50);
console.log(wallet.get()); // 50
// balance is completely inaccessible from the outside!`,
      output: `50`,
      executionSteps: [
        { line: 1, explanation: 'makeWallet() invoked; initializes private balance = 0' },
        { line: 3, explanation: 'Returns object containing add and get closures' },
        { line: 9, explanation: 'wallet.add(50) updates encapsulated balance' },
        { line: 10, explanation: 'wallet.get() reads private balance through closure' }
      ]
    },
    keyPoints: [
      'Inner function retains access to outer lexical scope variables.',
      'Enables true data privacy and encapsulation.',
      'Forms the underlying mechanism behind React hooks like useState and useEffect.'
    ],
    interviewTip: 'Interviewers often ask what happens if closures hold references to heavy DOM elements—warn them about potential memory leaks if not cleaned up.',
    tags: ['Closures', 'Data Privacy', 'Scope', 'Intermediate']
  },
  {
    id: 'js-15',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'How is the this keyword determined?',
    difficulty: 'Intermediate',
    summary: 'Standalone call: Points to window (or undefined in strict mode). Object method: Points to the object preceding the dot. new keyword: Points to the newly instantiated instance. Arrow functions: Bound lexically to the enclosing parent scope.',
    explanation: [
      'Default Binding: Standalone function invocation (fn()) binds this to global (window/global), or undefined in strict mode.',
      'Implicit Binding: When called as an object method (obj.fn()), this refers to the object preceding the dot.',
      'Explicit Binding: Using .call(), .apply(), or .bind() explicitly forces this to a specified object.',
      'Constructor Binding: When called with new Fn(), this points to the newly created instance object.',
      'Lexical Binding (Arrow Functions): Arrow functions do NOT have their own this; they inherit this from their enclosing lexical context at definition time.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'this-binding-rules.js',
      code: `const user = {
  name: "Alex",
  showName() { return this.name; }
};

console.log(user.showName()); // "Alex" (Implicit binding)

const detached = user.showName;
console.log(detached()); // undefined (Default binding in strict mode)

function Person(n) { this.name = n; }
const p = new Person("Sarah"); // Constructor binding
console.log(p.name); // "Sarah"`,
      output: `Alex
undefined
Sarah`,
      executionSteps: [
        { line: 6, explanation: 'user.showName() called: this bound to user object' },
        { line: 8, explanation: 'detached function reference called without context: this is undefined' },
        { line: 12, explanation: 'new Person creates new object and binds this to it' }
      ]
    },
    keyPoints: [
      '4 primary rules: Default, Implicit, Explicit, and "new" constructor binding.',
      'Arrow functions ignore standard binding rules and inherit lexical this.',
      'Precedence order: new > Explicit (bind/call/apply) > Implicit > Default.'
    ],
    interviewTip: 'Remember: Arrow functions cannot be bound with call, apply, or bind—their lexical this is immutable.',
    tags: ['this', 'Context', 'Binding', 'Objects']
  },
  {
    id: 'js-16',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'Differences between call(), apply(), and bind()',
    difficulty: 'Intermediate',
    summary: 'fn.call(context, arg1, arg2): Executes immediately with comma-separated arguments. fn.apply(context, [arg1, arg2]): Executes immediately with arguments as an array. fn.bind(context, arg1, arg2): Returns a new function with this permanently bound.',
    explanation: [
      'call(): Invokes the function immediately. The first argument sets this; subsequent arguments are passed individually separated by commas.',
      'apply(): Invokes the function immediately. The first argument sets this; subsequent arguments are passed as an array (or array-like object).',
      'bind(): Does NOT execute the function immediately. Instead, it returns a new function with this permanently bound to the provided object, and optional preset arguments (partial application).',
      'Memory: bind() creates a new function object in memory, whereas call() and apply() execute existing functions directly.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'call-apply-bind.js',
      code: `function introduce(greeting, punct) {
  return \`\${greeting}, I am \${this.name}\${punct}\`;
}

const dev = { name: "Himanshu" };

// 1. call: comma-separated arguments
console.log(introduce.call(dev, "Hello", "!"));

// 2. apply: array of arguments
console.log(introduce.apply(dev, ["Hi", "."]));

// 3. bind: returns a new bound function
const boundIntro = introduce.bind(dev, "Greetings");
console.log(boundIntro("!!"));`,
      output: `Hello, I am Himanshu!
Hi, I am Himanshu.
Greetings, I am Himanshu!!`,
      executionSteps: [
        { line: 8, explanation: 'introduce.call executes immediately with dev as this' },
        { line: 11, explanation: 'introduce.apply unpacks argument array and executes immediately' },
        { line: 14, explanation: 'introduce.bind returns new bound function with preset "Greetings"' }
      ]
    },
    keyPoints: [
      'call: executes immediately with comma-separated args.',
      'apply: executes immediately with array of args.',
      'bind: returns a new function with permanent this binding.'
    ],
    interviewTip: 'A mnemonic: "C" for Call = Comma-separated; "A" for Apply = Array.',
    tags: ['call', 'apply', 'bind', 'this', 'Functions']
  },
  {
    id: 'js-17',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'What are Arrow Functions, and how do they differ from regular functions?',
    difficulty: 'Beginner',
    summary: 'Provide concise syntax, have lexical this resolution, lack their own arguments object, and cannot be used as constructors with new.',
    explanation: [
      'Syntax: Compact syntax () => {}, with implicit return for single expressions.',
      'No this Binding: Arrow functions capture this from the surrounding lexical scope at declaration time. They do not have their own this.',
      'No arguments Object: Regular functions have access to the arguments pseudo-array. Arrow functions do not; use rest parameters (...args) instead.',
      'No Constructor: Arrow functions lack a [[Construct]] method and .prototype property, so invoking them with new throws a TypeError.',
      'No duplicate parameters: In non-strict mode regular functions allowed duplicate parameter names; arrow functions always disallow them.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'arrow-vs-regular.js',
      code: `const regular = function() {
  return arguments.length; // has arguments object
};

const arrow = (...args) => {
  // arguments is not defined; use rest parameters (...args)
  return args.length;
};

console.log(regular(1, 2, 3)); // 3
console.log(arrow(1, 2, 3));   // 3

// Arrow functions cannot be constructors:
// new arrow(); // TypeError: arrow is not a constructor`,
      output: `3
3`,
      executionSteps: [
        { line: 1, explanation: 'Regular function has implicit arguments array-like object' },
        { line: 5, explanation: 'Arrow function captures parameters via rest parameter (...args)' },
        { line: 10, explanation: 'Invoking both functions outputs length 3' }
      ]
    },
    keyPoints: [
      'Lexical this (inherits from outer scope).',
      'No arguments object; use ...args.',
      'Cannot be used as constructors with new.'
    ],
    interviewTip: 'Do not use arrow functions for object methods that rely on this.propertyName, as this will point to window/module rather than the object.',
    tags: ['Arrow Functions', 'ES6', 'Functions', 'this']
  },
  {
    id: 'js-18',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'What is Function Currying?',
    difficulty: 'Intermediate',
    summary: 'The technique of transforming a function that takes multiple arguments f(a, b, c) into a chain of unary functions f(a)(b)(c).',
    explanation: [
      'Currying Definition: Translating a function of arity N into a sequence of N functions that each accept a single argument.',
      'Implementation: Accomplished through closures, where each function captures an argument in its lexical environment until all required arguments are collected.',
      'Partial Application: Currying allows creating specialized variants of general functions by supplying arguments step-by-step.',
      'Composition: Extremely common in functional programming libraries (Ramda, Lodash/fp) and event handler setups.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'currying-pattern.js',
      code: `// Standard multi-argument function
function sum(a, b, c) {
  return a + b + c;
}

// Curried version using arrow functions & closures
const curriedSum = a => b => c => a + b + c;

console.log(curriedSum(1)(2)(3)); // 6

// Practical use case: Reusable loggers
const log = level => msg => \`[\${level.toUpperCase()}]: \${msg}\`;
const logError = log("error");
console.log(logError("Database connection failed"));`,
      output: `6
[ERROR]: Database connection failed`,
      executionSteps: [
        { line: 7, explanation: 'curriedSum defined as chain of unary arrow functions' },
        { line: 9, explanation: 'curriedSum(1)(2)(3) resolves step-by-step to 6' },
        { line: 12, explanation: 'log("error") pre-configures logError function' }
      ]
    },
    keyPoints: [
      'Transforms f(a, b, c) into f(a)(b)(c).',
      'Leverages closures to remember arguments across calls.',
      'Great for code reuse, configurable utilities, and partial application.'
    ],
    interviewTip: 'Interviewers often ask to write an infinite currying function: const add = a => b => b ? add(a + b) : a.',
    tags: ['Currying', 'Closures', 'Functional Programming', 'Intermediate']
  },
  {
    id: 'js-19',
    stack: 'javascript',
    topic: "Functions, 'this' Context & Closures",
    title: 'What are Pure Functions and Side Effects?',
    difficulty: 'Beginner',
    summary: 'Pure functions produce the exact same return value for identical arguments and have no observable side effects (no DOM changes, API requests, or external variable mutations).',
    explanation: [
      'Deterministic: Given inputs A and B, a pure function will ALWAYS return the exact same output, with zero dependency on external state.',
      'No Side Effects: It does not mutate external variables, make HTTP calls, modify the DOM, or log to the console.',
      'Referential Transparency: A call to a pure function can be replaced with its return value without altering program behavior.',
      'Benefits: Highly predictable, easy to test, straightforward to cache (memoization), and concurrency-safe.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'pure-functions.js',
      code: `// Pure function: deterministic & zero side effects
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // Always 5

// Impure function: modifies external state (side effect)
let count = 0;
function impureAdd(val) {
  count += val; // Side effect: mutates external variable
  return count;
}
console.log(impureAdd(2)); // 2
console.log(impureAdd(2)); // 4 (different output for same input!)`,
      output: `5
2
4`,
      executionSteps: [
        { line: 2, explanation: 'add(a, b) returns sum directly without side effects' },
        { line: 8, explanation: 'impureAdd modifies global count variable' },
        { line: 14, explanation: 'Second call to impureAdd(2) returns 4 instead of 2' }
      ]
    },
    keyPoints: [
      'Pure functions are deterministic (same input = same output).',
      'Zero side effects (no DOM manipulation, network requests, or global state mutations).',
      'Crucial foundation of React reducers and functional state management.'
    ],
    interviewTip: 'In React, Redux reducers and React component rendering functions MUST be pure to avoid unexpected re-rendering bugs.',
    tags: ['Pure Functions', 'Functional Programming', 'React', 'Basics']
  },

  // ==========================================
  // Topic 4: Objects, Prototypes & Classes
  // ==========================================
  {
    id: 'js-20',
    stack: 'javascript',
    topic: 'Objects, Prototypes & Classes',
    title: 'What is Prototypal Inheritance and the Prototype Chain?',
    difficulty: 'Intermediate',
    summary: 'Objects inherit properties and methods directly from other objects via an internal prototype link ([[Prototype]]). If a property is not on the instance, the engine traverses upward along the chain until finding it or hitting null.',
    explanation: [
      '[[Prototype]] Link: In JavaScript, every object has an internal link to another object called its prototype. This link is accessible via Object.getPrototypeOf(obj) or the __proto__ accessor.',
      'Prototype Chain: When accessing obj.prop, the engine checks obj. If absent, it checks obj’s prototype, then that prototype’s prototype, all the way up to Object.prototype.',
      'Chain Terminator: Object.prototype.[[Prototype]] is null. If a property is not found before reaching null, JavaScript returns undefined.',
      'Memory Efficiency: Methods defined on prototypes are shared across all instances rather than re-created for each object.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'prototype-chain.js',
      code: `const vehicle = {
  hasWheels: true,
  drive() { return "Driving..."; }
};

const car = Object.create(vehicle);
car.doors = 4;

console.log(car.doors);     // 4 (own property)
console.log(car.hasWheels);  // true (inherited via prototype)
console.log(car.drive());    // "Driving..." (from prototype chain)
console.log(Object.getPrototypeOf(vehicle) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null (end of chain)`,
      output: `4
true
Driving...
true
null`,
      executionSteps: [
        { line: 6, explanation: 'car created with vehicle as its prototype' },
        { line: 10, explanation: 'car.hasWheels not found on car; engine traverses to vehicle prototype' },
        { line: 13, explanation: 'Object.prototype prototype evaluated: returns null' }
      ]
    },
    keyPoints: [
      'Objects inherit directly from other objects via [[Prototype]].',
      'The chain terminates at Object.prototype.[[Prototype]] === null.',
      'Provides shared methods without duplicating functions in memory.'
    ],
    interviewTip: 'Differentiate between Constructor.prototype (the template object attached to constructors) and instance.__proto__ (the actual link on instances).',
    tags: ['Prototypes', 'Inheritance', 'OOP', 'Prototype Chain']
  },
  {
    id: 'js-21',
    stack: 'javascript',
    topic: 'Objects, Prototypes & Classes',
    title: 'What happens behind the scenes with the new keyword?',
    difficulty: 'Intermediate',
    summary: 'Creates a new empty object: {}. Binds the new object\'s prototype to the constructor\'s .prototype. Executes the constructor function with this referencing the new object. Returns the object automatically.',
    explanation: [
      'Step 1 (Creation): An empty, plain JavaScript object is allocated in memory: {}.',
      'Step 2 (Prototype Linking): The new object’s internal [[Prototype]] is linked to the constructor function’s .prototype property.',
      'Step 3 (Execution): The constructor function is executed with this bound to the newly created object.',
      'Step 4 (Return): If the constructor explicitly returns a non-primitive object, that object is returned; otherwise, the newly created object from Step 1 is returned.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'new-keyword-simulation.js',
      code: `function User(name) {
  this.name = name;
}
User.prototype.sayHi = function() {
  return \`Hi, I am \${this.name}\`;
};

// Custom implementation simulating the 4 steps of 'new':
function customNew(Constructor, ...args) {
  const obj = {}; // 1. Create empty object
  Object.setPrototypeOf(obj, Constructor.prototype); // 2. Link prototype
  const result = Constructor.apply(obj, args); // 3. Execute with 'this'
  return result instanceof Object ? result : obj; // 4. Return object
}

const u = customNew(User, "Himanshu");
console.log(u.sayHi()); // "Hi, I am Himanshu"`,
      output: `Hi, I am Himanshu`,
      executionSteps: [
        { line: 10, explanation: 'Step 1: Empty object obj created' },
        { line: 11, explanation: 'Step 2: Prototype linked to Constructor.prototype' },
        { line: 12, explanation: 'Step 3: Constructor executed with obj as this' },
        { line: 13, explanation: 'Step 4: Returns new obj' }
      ]
    },
    keyPoints: [
      'Creates empty object, links prototype, binds this, returns instance.',
      'If constructor returns an object explicitly, that object overrides the return.',
      'Functions called without new have this bound to global/undefined.'
    ],
    interviewTip: 'Mention new.target: ES6 introduced new.target to detect whether a function was invoked with new or called normally.',
    tags: ['new', 'OOP', 'Constructors', 'Prototypes']
  },
  {
    id: 'js-22',
    stack: 'javascript',
    topic: 'Objects, Prototypes & Classes',
    title: 'How do ES6 Classes work with super()?',
    difficulty: 'Intermediate',
    summary: 'Classes are syntactic sugar over prototypes. In subclassing, super() invokes the parent class constructor to initialize this. Accessing this before calling super() throws a ReferenceError.',
    explanation: [
      'Syntactic Sugar: ES6 classes do not introduce a new object-oriented inheritance model; they are modern syntax over JavaScript\'s existing prototypal inheritance.',
      'Derived Classes (extends): When a class extends a parent class, its constructor must call super() before accessing any property on this.',
      'Parent Constructor Call: super(...args) invokes the parent constructor and initializes this in derived classes.',
      'Method Overriding: In subclass methods, super.methodName() can be used to call the parent class\'s version of the method.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'es6-classes-super.js',
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a noise.\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Must call super before accessing 'this'!
    this.breed = breed;
  }
  speak() {
    return \`\${super.speak()} Specifically barks!\`;
  }
}

const d = new Dog("Rex", "German Shepherd");
console.log(d.speak());`,
      output: `Rex makes a noise. Specifically barks!`,
      executionSteps: [
        { line: 12, explanation: 'Dog constructor invokes super(name) to initialize parent Animal properties' },
        { line: 13, explanation: 'Dog initializes its own breed property on this' },
        { line: 16, explanation: 'super.speak() calls parent speak method from prototype' }
      ]
    },
    keyPoints: [
      'super() invokes the parent constructor.',
      'In derived classes, this cannot be accessed before calling super().',
      'ES6 classes are syntactic sugar over prototypal inheritance.'
    ],
    interviewTip: 'Unlike traditional prototype inheritance where child creates this, in ES6 class inheritance the parent constructor creates this and child constructor modifies it.',
    tags: ['ES6 Classes', 'super', 'OOP', 'Inheritance']
  },
  {
    id: 'js-23',
    stack: 'javascript',
    topic: 'Objects, Prototypes & Classes',
    title: 'How do you convert Objects into Arrays?',
    difficulty: 'Beginner',
    summary: 'Object.keys(obj) returns property names. Object.values(obj) returns property values. Object.entries(obj) returns nested [key, value] pairs.',
    explanation: [
      'Object.keys(obj): Returns an array of an object\'s own enumerable string-keyed property names.',
      'Object.values(obj): Returns an array of an object\'s own enumerable property values in the same order as for...in.',
      'Object.entries(obj): Returns an array of an object\'s own enumerable string-keyed key-value pairs as [key, value] tuples.',
      'Object.fromEntries(): The inverse of Object.entries(), converting a list of key-value pairs back into an object.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'object-to-array.js',
      code: `const user = { name: "Himanshu", role: "Developer", exp: 5 };

console.log(Object.keys(user));
// Output: ["name", "role", "exp"]

console.log(Object.values(user));
// Output: ["Himanshu", "Developer", 5]

console.log(Object.entries(user));
// Output: [["name", "Himanshu"], ["role", "Developer"], ["exp", 5]]`,
      output: `[ 'name', 'role', 'exp' ]
[ 'Himanshu', 'Developer', 5 ]
[ [ 'name', 'Himanshu' ], [ 'role', 'Developer' ], [ 'exp', 5 ] ]`,
      executionSteps: [
        { line: 3, explanation: 'Object.keys extracts property names into an array' },
        { line: 6, explanation: 'Object.values extracts property values into an array' },
        { line: 9, explanation: 'Object.entries extracts [key, value] tuples' }
      ]
    },
    keyPoints: [
      'Object.keys(obj) -> array of keys.',
      'Object.values(obj) -> array of values.',
      'Object.entries(obj) -> array of [key, value] pairs.'
    ],
    interviewTip: 'Use Object.entries(obj) combined with Array.prototype.filter or map and Object.fromEntries to easily transform objects.',
    tags: ['Objects', 'Arrays', 'ES6', 'Object.entries']
  },
  {
    id: 'js-24',
    stack: 'javascript',
    topic: 'Objects, Prototypes & Classes',
    title: 'Difference between Object.freeze() and Object.seal()',
    difficulty: 'Intermediate',
    summary: 'Object.freeze(): Makes the object completely immutable (no adding, deleting, or editing properties). Object.seal(): Prevents adding or deleting properties, but existing writable properties can still be modified.',
    explanation: [
      'Object.seal(): Prevents new properties from being added and marks all existing properties as non-configurable (cannot be deleted). Existing writable properties CAN still be changed.',
      'Object.freeze(): Does everything Object.seal() does, AND additionally marks all existing properties as writable: false (cannot edit existing properties).',
      'Shallow by Nature: Both methods are shallow! Nested child objects inside frozen or sealed objects remain mutable unless deeply frozen recursively.',
      'Detection: Object.isFrozen(obj) and Object.isSealed(obj) check object freeze/seal status.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'freeze-vs-seal.js',
      code: `// 1. Object.seal
const sealed = { score: 10 };
Object.seal(sealed);
sealed.score = 20;  // Allowed: modifying existing property
delete sealed.score; // Forbidden: cannot delete
sealed.bonus = 5;    // Forbidden: cannot add
console.log(sealed); // { score: 20 }

// 2. Object.freeze
const frozen = { score: 10 };
Object.freeze(frozen);
frozen.score = 20;   // Forbidden: cannot edit
console.log(frozen.score); // 10`,
      output: `{ score: 20 }
10`,
      executionSteps: [
        { line: 3, explanation: 'Object.seal applied: existing property modification permitted' },
        { line: 4, explanation: 'sealed.score updated to 20' },
        { line: 11, explanation: 'Object.freeze applied: property mutation ignored (or throws TypeError in strict mode)' }
      ]
    },
    keyPoints: [
      'Object.seal allows modifying existing properties, but disallows adding or deleting.',
      'Object.freeze disallows adding, deleting, AND modifying properties.',
      'Both operations are shallow and only affect top-level keys.'
    ],
    interviewTip: 'In strict mode ("use strict"), attempting to modify a frozen object or add to a sealed object throws a TypeError instead of silently failing.',
    tags: ['Object.freeze', 'Object.seal', 'Immutability', 'Security']
  },

  // ==========================================
  // Topic 5: ES6+ Modern JavaScript Features
  // ==========================================
  {
    id: 'js-25',
    stack: 'javascript',
    topic: 'ES6+ Modern JavaScript Features',
    title: 'Rest Parameter vs. Spread Operator (...)',
    difficulty: 'Beginner',
    summary: 'Rest gathers remaining function arguments into an array: function sum(...nums). Spread expands an array or object into individual elements: [...arr1, ...arr2].',
    explanation: [
      'Same Syntax (...): Both use three dots, but perform opposite actions based on context.',
      'Rest Parameter: Used in function parameter declarations to condense an indefinite number of arguments into a single genuine array (e.g. fn(a, ...rest)). Must be the last parameter.',
      'Spread Operator: Used in expressions to unpack/expand iterable elements (arrays, strings) or object properties into separate elements (e.g. [...arr], {...obj}).',
      'Replacement: Rest replaces the older arguments object with a real array; Spread replaces Function.prototype.apply and Object.assign.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'rest-vs-spread.js',
      code: `// 1. Rest Parameter (Condenses elements into an array)
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// 2. Spread Operator (Expands array/object into items)
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4]`,
      output: `10
[ 1, 2, 3, 4 ]`,
      executionSteps: [
        { line: 2, explanation: 'Rest parameter collects 1, 2, 3, 4 into array [1, 2, 3, 4]' },
        { line: 11, explanation: 'Spread operator unpacks arr1 and arr2 into new array' }
      ]
    },
    keyPoints: [
      'Rest: gathers elements into an array (in function parameters or destructuring).',
      'Spread: expands an array or object into individual elements.',
      'Rest parameters must always be at the end of the argument list.'
    ],
    interviewTip: 'Spread performs a SHALLOW copy of objects and arrays. Nested objects still share reference pointers.',
    tags: ['Rest', 'Spread', 'ES6', 'Arrays']
  },
  {
    id: 'js-26',
    stack: 'javascript',
    topic: 'ES6+ Modern JavaScript Features',
    title: 'What is Destructuring Assignment?',
    difficulty: 'Beginner',
    summary: 'Syntax to unpack values from arrays or properties from objects directly into distinct variables.',
    explanation: [
      'Object Destructuring: Matches properties by name: const { name, age } = user. Can rename variables ({ name: userName }) and assign fallback defaults ({ age = 18 }).',
      'Array Destructuring: Matches elements by positional index: const [first, second] = list. Can skip items using empty commas: const [first, , third] = list.',
      'Nested Destructuring: Deep values can be extracted in one statement: const { address: { city } } = user.',
      'Function Parameters: Functions can destructure incoming object arguments directly in the parameter signature.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'destructuring-syntax.js',
      code: `// Object destructuring with default value and renaming
const user = { name: "Himanshu", age: 25 };
const { name: userName, age, city = "Delhi" } = user;
console.log(userName, age, city); // "Himanshu" 25 "Delhi"

// Array destructuring with item skipping
const items = ["React", "Vue", "Angular"];
const [first, , third] = items;
console.log(first, third); // "React" "Angular"`,
      output: `Himanshu 25 Delhi
React Angular`,
      executionSteps: [
        { line: 3, explanation: 'name renamed to userName; city gets default value "Delhi"' },
        { line: 8, explanation: 'first extracts index 0 ("React"), third extracts index 2 ("Angular")' }
      ]
    },
    keyPoints: [
      'Unpacks values from arrays by index, and from objects by property key.',
      'Supports default fallback values and variable renaming.',
      'Extensively used in React props and state hook declarations.'
    ],
    interviewTip: 'Destructuring null or undefined throws a TypeError: Cannot destructure property of null/undefined.',
    tags: ['Destructuring', 'ES6', 'Syntax', 'Clean Code']
  },
  {
    id: 'js-27',
    stack: 'javascript',
    topic: 'ES6+ Modern JavaScript Features',
    title: 'What are Generator Functions?',
    difficulty: 'Advanced',
    summary: 'Declared with function*, generators can pause execution with yield and resume when the iterator\'s .next() is called.',
    explanation: [
      'Definition: Declared using function* syntax. When called, a generator function does not execute its body immediately; it returns a Generator iterator object.',
      'yield Keyword: Pauses generator execution and sends a value back to the caller: { value: x, done: false }.',
      'next() Method: Resumes execution from where it was paused until the next yield or return statement.',
      'Two-Way Communication: Values can be passed into .next(val), which replaces the current yield expression inside the generator.',
      'Use Cases: Infinite sequences, async orchestration (precursor to async/await), Redux Saga.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'generator-functions.js',
      code: `function* idGenerator() {
  let id = 1;
  while (id <= 3) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }`,
      output: `{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true }`,
      executionSteps: [
        { line: 8, explanation: 'idGenerator invoked; returns generator iterator' },
        { line: 9, explanation: 'gen.next() yields 1 and pauses execution' },
        { line: 12, explanation: 'Generator completes; done is set to true' }
      ]
    },
    keyPoints: [
      'Declared with function* and controlled using yield.',
      'Execution pauses at yield and resumes with .next().',
      'Produces standard ES6 Iterators compatible with for...of and spread.'
    ],
    interviewTip: 'Explain how async/await is built conceptually on top of generator functions combined with promises (like the "co" library).',
    tags: ['Generators', 'Iterators', 'ES6', 'Advanced']
  },
  {
    id: 'js-28',
    stack: 'javascript',
    topic: 'ES6+ Modern JavaScript Features',
    title: 'Explain Set, Map, WeakSet, and WeakMap',
    difficulty: 'Intermediate',
    summary: 'Set: Stores unique values of any type. Map: Stores key-value pairs where keys can be any type. WeakSet: Stores only objects; entries are weakly referenced, permitting garbage collection. WeakMap: Stores key-value pairs where keys must be objects, held weakly for garbage collection.',
    explanation: [
      'Set: Collection of unique values of any type. Duplicate additions are ignored. Preserves insertion order.',
      'Map: Ordered dictionary of [key, value] pairs. Unlike regular objects whose keys must be strings/symbols, Map keys can be anything—objects, functions, or primitives.',
      'WeakSet: Only holds object references. Objects are held weakly, meaning if no other references exist, the object can be garbage collected.',
      'WeakMap: Keys must be objects and are held weakly. Values can be anything. Not iterable, no .size property, preventing memory leaks for DOM metadata or private fields.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'collections-comparison.js',
      code: `// 1. Set: unique values only
const set = new Set([1, 2, 2, 3]);
console.log([...set]); // [1, 2, 3]

// 2. Map: any type can be a key
const map = new Map();
const keyObj = { id: 1 };
map.set(keyObj, "User Metadata");
console.log(map.get(keyObj)); // "User Metadata"

// 3. WeakMap: keys must be objects, enables garbage collection
const wm = new WeakMap();
let obj = { temp: true };
wm.set(obj, "cached");
console.log(wm.has(obj)); // true`,
      output: `[ 1, 2, 3 ]
User Metadata
true`,
      executionSteps: [
        { line: 2, explanation: 'Set ignores duplicate 2 and stores unique values' },
        { line: 7, explanation: 'Map associates object keyObj with metadata string' },
        { line: 13, explanation: 'WeakMap registers obj without preventing garbage collection' }
      ]
    },
    keyPoints: [
      'Set stores unique values; Map stores key-value pairs with any key type.',
      'WeakSet/WeakMap hold weak references to object keys to allow garbage collection.',
      'Weak collections are not enumerable and have no .size property.'
    ],
    interviewTip: 'A primary use case for WeakMap is associating metadata with DOM nodes without causing memory leaks when nodes are removed from the DOM.',
    tags: ['Set', 'Map', 'WeakMap', 'WeakSet', 'Memory Management']
  },

  // ==========================================
  // Topic 6: Array Methods & Handwritten Polyfills
  // ==========================================
  {
    id: 'js-29',
    stack: 'javascript',
    topic: 'Array Methods & Handwritten Polyfills',
    title: 'Differences among map(), filter(), reduce(), and forEach()',
    difficulty: 'Beginner',
    summary: 'map(): Returns a new array with callback transformations applied to every element. filter(): Returns a new array containing elements that evaluate to truthy against the test condition. reduce(): Accumulates array values into a single return value. forEach(): Iterates through elements without returning a new array (returns undefined).',
    explanation: [
      'map(): Pure transformation. Returns a new array of the same length where each element is the return value of the callback.',
      'filter(): Selective copying. Returns a new array containing only elements where the callback returned a truthy value.',
      'reduce(): Folding / Aggregation. Iterates through the array and returns a single accumulated result (number, object, array, etc.).',
      'forEach(): Imperative loop. Calls the callback for each element solely for side effects; always returns undefined and cannot be chained.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'array-methods.js',
      code: `const nums = [1, 2, 3, 4];

// map transforms each item
console.log(nums.map(x => x * 2)); // [2, 4, 6, 8]

// filter tests each item
console.log(nums.filter(x => x % 2 === 0)); // [2, 4]

// reduce aggregates into one value
console.log(nums.reduce((acc, x) => acc + x, 0)); // 10

// forEach performs side effects, returns undefined
const sideEffect = nums.forEach(x => {});
console.log(sideEffect); // undefined`,
      output: `[ 2, 4, 6, 8 ]
[ 2, 4 ]
10
undefined`,
      executionSteps: [
        { line: 4, explanation: 'map produces new array with doubled numbers' },
        { line: 7, explanation: 'filter checks even numbers, returning [2, 4]' },
        { line: 10, explanation: 'reduce computes sum 1 + 2 + 3 + 4 = 10' }
      ]
    },
    keyPoints: [
      'map, filter, reduce return new values and are chainable.',
      'forEach returns undefined and is intended for side effects.',
      'None of these methods mutate the original array by default.'
    ],
    interviewTip: 'Remember that you cannot break or return early from a forEach loop. Use for...of or Array.prototype.some() instead if early exit is required.',
    tags: ['Array Methods', 'Functional Programming', 'map', 'filter', 'reduce']
  },
  {
    id: 'js-30',
    stack: 'javascript',
    topic: 'Array Methods & Handwritten Polyfills',
    title: 'Difference between slice() and splice()',
    difficulty: 'Beginner',
    summary: 'slice(start, end): Non-mutating; returns a shallow copy of a portion of the array. splice(start, deleteCount, ...items): Mutates the original array by deleting or inserting elements, returning the removed items.',
    explanation: [
      'slice(start, end): Pure method. Does NOT modify the original array. Returns a shallow copy from start index up to, but not including, end index.',
      'splice(start, deleteCount, ...items): Impure method. Modifies (mutates) the original array in place by removing, replacing, or inserting items. Returns an array of deleted items.',
      'Negative Indices: Both accept negative indices counting backwards from the end of the array.',
      'Immutability: In React state management, always prefer slice over splice to maintain immutable state.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'slice-vs-splice.js',
      code: `const arr = ["a", "b", "c", "d"];

// slice(start, end) -> does NOT mutate original array
const sliced = arr.slice(1, 3);
console.log(sliced); // ["b", "c"]
console.log(arr);    // ["a", "b", "c", "d"] (unchanged)

// splice(start, deleteCount, insertItem) -> MUTATES original array
const spliced = arr.splice(1, 2, "X");
console.log(spliced); // ["b", "c"] (deleted elements)
console.log(arr);     // ["a", "X", "d"] (mutated original array!)`,
      output: `[ 'b', 'c' ]
[ 'a', 'b', 'c', 'd' ]
[ 'b', 'c' ]
[ 'a', 'X', 'd' ]`,
      executionSteps: [
        { line: 4, explanation: 'arr.slice(1, 3) extracts elements at index 1 and 2 without modifying arr' },
        { line: 9, explanation: 'arr.splice(1, 2, "X") deletes 2 items starting from index 1 and inserts "X"' }
      ]
    },
    keyPoints: [
      'slice is non-mutating and returns a new shallow copy.',
      'splice mutates the original array and returns the removed items.',
      'slice takes (start, end); splice takes (start, deleteCount, ...insertItems).'
    ],
    interviewTip: 'To remember which one mutates: "splice" has a "p" for "Permanent" change (mutates original).',
    tags: ['Arrays', 'slice', 'splice', 'Immutability']
  },
  {
    id: 'js-31',
    stack: 'javascript',
    topic: 'Array Methods & Handwritten Polyfills',
    title: 'Hand-written Polyfill: Array.prototype.map()',
    difficulty: 'Intermediate',
    summary: 'Custom polyfill for Array.prototype.map using prototype method binding, handling sparse arrays and callback invocation.',
    explanation: [
      'Type Check: Validates that the provided callback is an executable function, throwing a TypeError if not.',
      'Context Binding: Supports binding this context through an optional thisArg parameter if supplied.',
      'Sparse Array Handling: Uses i in this check to handle empty/deleted slots in sparse arrays appropriately.',
      'Return Value: Pushes callback outputs into a new array and returns it, leaving the original array intact.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'polyfill-map.js',
      code: `Array.prototype.myMap = function(callback) {
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) result.push(callback(this[i], i, this));
  }
  return result;
};

const nums = [1, 2, 3];
console.log(nums.myMap(x => x * 10)); // [10, 20, 30]`,
      output: `[ 10, 20, 30 ]`,
      executionSteps: [
        { line: 1, explanation: 'myMap attached to Array.prototype' },
        { line: 2, explanation: 'Validates that callback is a function' },
        { line: 4, explanation: 'Iterates through indices, invoking callback with (element, index, array)' },
        { line: 11, explanation: 'Output: [10, 20, 30]' }
      ]
    },
    keyPoints: [
      'Throws TypeError if callback is not a function.',
      'Passes (element, index, array) to the callback.',
      'Handles sparse arrays using the "in" operator.'
    ],
    interviewTip: 'Mentioning the "i in this" check shows senior-level awareness of sparse array edge cases in JavaScript engines.',
    tags: ['Polyfills', 'Array.prototype.map', 'Arrays', 'Machine Coding']
  },
  {
    id: 'js-32',
    stack: 'javascript',
    topic: 'Array Methods & Handwritten Polyfills',
    title: 'Hand-written Polyfill: Array.prototype.filter()',
    difficulty: 'Intermediate',
    summary: 'Custom polyfill for Array.prototype.filter checking elements against a predicate callback function.',
    explanation: [
      'Validation: Ensures the callback is a callable function.',
      'Filtering Logic: Evaluates callback(this[i], i, this). If truthy, the current item is appended to the result array.',
      'Non-Mutating: Does not alter the original this array.',
      'Sparse Arrays: Checks i in this to skip empty array indices.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'polyfill-filter.js',
      code: `Array.prototype.myFilter = function(callback) {
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

const nums = [1, 2, 3, 4, 5];
console.log(nums.myFilter(x => x > 2)); // [3, 4, 5]`,
      output: `[ 3, 4, 5 ]`,
      executionSteps: [
        { line: 1, explanation: 'myFilter registered on Array.prototype' },
        { line: 5, explanation: 'Evaluates predicate: pushes item if truthy' },
        { line: 11, explanation: 'Returns filtered array [3, 4, 5]' }
      ]
    },
    keyPoints: [
      'Evaluates predicate callback for each array item.',
      'Returns a new array with elements that passed the test.',
      'Leaves original array unchanged.'
    ],
    interviewTip: 'Make sure not to use arrow functions when implementing prototype methods, as arrow functions lack dynamic this binding.',
    tags: ['Polyfills', 'filter', 'Arrays', 'Machine Coding']
  },
  {
    id: 'js-33',
    stack: 'javascript',
    topic: 'Array Methods & Handwritten Polyfills',
    title: 'Hand-written Polyfill: Array.prototype.reduce()',
    difficulty: 'Advanced',
    summary: 'Custom polyfill for Array.prototype.reduce supporting initial accumulator values and empty array safety checks.',
    explanation: [
      'Initial Value Handling: If initialValue is passed, accumulator starts with that value and loop starts at index 0. If omitted, accumulator defaults to this[0] and loop starts at index 1.',
      'Empty Array Error: If an empty array is reduced without an initialValue, a TypeError is thrown according to the ECMAScript spec.',
      'Sparse Array Support: Checks i in this to ensure skipped indexes do not cause unexpected operations.',
      'Return Value: Returns the single accumulated value after processing all elements.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'polyfill-reduce.js',
      code: `Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
  let acc = initialValue;
  let startIndex = 0;
  if (arguments.length < 2) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this);
  }
  return acc;
};

const nums = [1, 2, 3, 4];
console.log(nums.myReduce((acc, curr) => acc + curr, 0)); // 10`,
      output: `10`,
      executionSteps: [
        { line: 5, explanation: 'Checks arguments.length < 2 to detect if initialValue was passed' },
        { line: 6, explanation: 'Throws TypeError if empty array reduced without initialValue' },
        { line: 11, explanation: 'Iterates and accumulates return values from callback' },
        { line: 17, explanation: 'Returns final sum 10' }
      ]
    },
    keyPoints: [
      'Detects whether initialValue was provided using arguments.length.',
      'Handles empty array error per ECMAScript specification.',
      'Accumulates values through callback(acc, curr, index, array).'
    ],
    interviewTip: 'The key interview trap in reduce polyfills is checking arguments.length < 2 rather than if (!initialValue), because initialValue could be valid falsy values like 0 or null!',
    tags: ['Polyfills', 'reduce', 'Arrays', 'Advanced']
  },

  // ==========================================
  // Topic 7: Asynchronous JavaScript & The Event Loop
  // ==========================================
  {
    id: 'js-34',
    stack: 'javascript',
    topic: 'Asynchronous JavaScript & The Event Loop',
    title: 'How does the Event Loop manage Microtasks vs. Macrotasks?',
    difficulty: 'Intermediate',
    summary: 'The Call Stack runs synchronous code first. When the Call Stack clears, the engine drains all jobs in the Microtask Queue (Promises, queueMicrotask, MutationObserver). Once microtasks are complete, the engine processes one task from the Macrotask Queue (setTimeout, setInterval, I/O) per turn.',
    explanation: [
      'Call Stack: Executes synchronous JavaScript code in a single-threaded execution context.',
      'Microtask Queue: Higher priority queue. Includes Promise callbacks (.then, .catch, .finally), queueMicrotask(), and MutationObserver. The engine empties the ENTIRE microtask queue before moving forward.',
      'Macrotask (Task) Queue: Lower priority queue. Includes setTimeout, setInterval, setImmediate, I/O events, and UI rendering. Only ONE macrotask is executed per event loop iteration.',
      'Rendering Opportunity: Browser rendering and layout updates happen between the draining of microtasks and the start of the next macrotask.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-loop-queues.js',
      code: `console.log("1. Stack Sync");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise)");
});

console.log("2. Stack Sync End");`,
      output: `1. Stack Sync
2. Stack Sync End
3. Microtask (Promise)
4. Macrotask (setTimeout)`,
      executionSteps: [
        { line: 1, explanation: 'Synchronous "1. Stack Sync" logs immediately' },
        { line: 3, explanation: 'setTimeout callback queued to Macrotask Queue' },
        { line: 7, explanation: 'Promise.then callback queued to Microtask Queue' },
        { line: 11, explanation: 'Synchronous "2. Stack Sync End" logs' },
        { line: 7, explanation: 'Call stack empty: drains Microtask Queue (logs 3)' },
        { line: 3, explanation: 'Drains next macrotask (logs 4)' }
      ]
    },
    keyPoints: [
      'Microtasks (Promises) take strict priority over macrotasks (setTimeout).',
      'The entire microtask queue is emptied before the next macrotask is executed.',
      'Single-threaded event loop coordinates asynchronous I/O and UI rendering.'
    ],
    interviewTip: 'Starving the event loop: Recursively queuing microtasks will starve the macrotask queue and UI rendering, freezing the page!',
    tags: ['Event Loop', 'Microtasks', 'Macrotasks', 'Async', 'Promises']
  },
  {
    id: 'js-35',
    stack: 'javascript',
    topic: 'Asynchronous JavaScript & The Event Loop',
    title: 'What are the Promise combinators?',
    difficulty: 'Intermediate',
    summary: 'Promise.all(): Resolves when all succeed; fails immediately if any single promise rejects. Promise.allSettled(): Waits for all promises to settle, returning status objects for each. Promise.race(): Settles as soon as the first promise resolves or rejects. Promise.any(): Resolves as soon as the first promise fulfills; rejects if all promises fail.',
    explanation: [
      'Promise.all(): "All or nothing". Takes an iterable of promises. Resolves when all resolve; rejects immediately if any single promise rejects.',
      'Promise.allSettled(): "Wait for all". Introduced in ES2020. Always resolves after all promises settle, returning an array of objects with { status: "fulfilled", value } or { status: "rejected", reason }.',
      'Promise.race(): "First to settle". Resolves or rejects as soon as the first promise resolves or rejects.',
      'Promise.any(): "First to fulfill". Introduced in ES2021. Resolves as soon as any single promise succeeds. Rejects with an AggregateError only if ALL promises reject.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'promise-combinators.js',
      code: `const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
const p3 = Promise.reject("Failed");

// allSettled waits for all outcomes regardless of rejection
Promise.allSettled([p1, p3]).then(results => {
  console.log(results[0].status); // "fulfilled"
  console.log(results[1].status); // "rejected"
});

// race returns first settled promise
Promise.race([p1, p2]).then(val => {
  console.log("Race winner:", val); // 10
});`,
      output: `fulfilled
rejected
Race winner: 10`,
      executionSteps: [
        { line: 5, explanation: 'Promise.allSettled monitors both p1 and p3 to completion' },
        { line: 12, explanation: 'Promise.race resolves with 10 as p1 wins the race' }
      ]
    },
    keyPoints: [
      'Promise.all: fail-fast on first rejection.',
      'Promise.allSettled: never rejects; gives status of all promises.',
      'Promise.race: settles with the first resolved or rejected outcome.',
      'Promise.any: resolves with first fulfillment; rejects if all fail.'
    ],
    interviewTip: 'Use Promise.allSettled() when you need partial successes (e.g. fetching independent dashboard widgets).',
    tags: ['Promises', 'Async', 'Promise Combinators', 'ES2020']
  },
  {
    id: 'js-36',
    stack: 'javascript',
    topic: 'Asynchronous JavaScript & The Event Loop',
    title: 'Proper Error Handling with async/await and fetch()',
    difficulty: 'Beginner',
    summary: 'fetch() does not reject on HTTP 404 or 500 status codes; check response.ok.',
    explanation: [
      'Fetch Quirks: The fetch() API only rejects a promise on network failures (e.g., offline, DNS lookup failure, CORS blockage).',
      'HTTP Error Statuses: A 404 Not Found or 500 Internal Server Error is considered a successful HTTP transaction by fetch, meaning the promise fulfills!',
      'response.ok: Always inspect response.ok (true for status codes 200–299) and throw an error manually if false.',
      'try/catch with async/await: Wrap fetch inside try/catch blocks to gracefully handle both network disconnects and manually thrown HTTP errors.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'fetch-error-handling.js',
      code: `async function loadData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}

// Simulated inspection of non-ok response:
const mockRes = { ok: false, status: 404 };
if (!mockRes.ok) console.log("HTTP error " + mockRes.status);`,
      output: `HTTP error 404`,
      executionSteps: [
        { line: 3, explanation: 'Awaits fetch network request' },
        { line: 4, explanation: 'Verifies res.ok status to catch 4xx/5xx HTTP errors' },
        { line: 7, explanation: 'catches both network errors and thrown HTTP status errors' }
      ]
    },
    keyPoints: [
      'fetch does not reject on HTTP 404 or 500 errors.',
      'Always verify response.ok before parsing response.json().',
      'Use try/catch with async/await for complete error containment.'
    ],
    interviewTip: 'A classic frontend interview bug: candidates forget to check res.ok and wonder why catch blocks don\'t trigger on 404s!',
    tags: ['fetch', 'async/await', 'Error Handling', 'HTTP']
  },

  // ==========================================
  // Topic 8: Browser DOM, BOM & Web APIs
  // ==========================================
  {
    id: 'js-37',
    stack: 'javascript',
    topic: 'Browser DOM, BOM & Web APIs',
    title: 'Event Bubbling, Capturing, and Event Delegation',
    difficulty: 'Intermediate',
    summary: 'Events propagate through Capturing (down from window to the target), reach the Target, then proceed to Bubbling (up from target to window). event.stopPropagation() stops the event from traversing further along the chain. event.preventDefault() cancels the browser default action. Event Delegation: Placing a single event listener on a parent wrapper to monitor events from existing and dynamically added child elements via bubbling.',
    explanation: [
      'Capturing Phase: The event trickles down through the DOM hierarchy from window -> document -> body -> target element.',
      'Target Phase: The event reaches the element where the interaction originated (event.target).',
      'Bubbling Phase: The event bubbles upward from the target back to window. Most standard event listeners attach during bubbling by default.',
      'stopPropagation vs preventDefault: stopPropagation() prevents the event from bubbling up the DOM; preventDefault() suppresses default browser actions (like following links or submitting forms).',
      'Event Delegation: Attaching one listener to a parent container instead of hundreds of listeners to child nodes, using event.target to identify which child was clicked.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-delegation.js',
      code: `// Event Delegation on a dynamic list
// HTML: <ul id="todo-list"><li>Item 1</li><li>Item 2</li></ul>

const list = document.getElementById("todo-list");
if (list) {
  list.addEventListener("click", function(e) {
    // Check if clicked element was an LI element
    if (e.target && e.target.nodeName === "LI") {
      console.log("Clicked list item:", e.target.textContent);
    }
  });
}`,
      output: `Clicked list item: Item 1`,
      executionSteps: [
        { line: 4, explanation: 'Single click listener attached to parent #todo-list' },
        { line: 6, explanation: 'Checks e.target to identify clicked child element' },
        { line: 7, explanation: 'Works for existing items and dynamically appended items without extra listeners' }
      ]
    },
    keyPoints: [
      '3 phases: Capturing -> Target -> Bubbling.',
      'stopPropagation stops bubbling; preventDefault cancels browser defaults.',
      'Event delegation uses bubbling to manage events efficiently with fewer listeners.'
    ],
    interviewTip: 'React uses event delegation under the hood, attaching synthetic event handlers at the root level rather than individual DOM nodes.',
    tags: ['DOM', 'Events', 'Bubbling', 'Event Delegation']
  },
  {
    id: 'js-38',
    stack: 'javascript',
    topic: 'Browser DOM, BOM & Web APIs',
    title: 'DOM vs. BOM Differences',
    difficulty: 'Beginner',
    summary: 'DOM (Document Object Model): The document tree representing the webpage\'s HTML structure (via document). BOM (Browser Object Model): Browser interfaces and window APIs (via window, including navigator, location, history, screen).',
    explanation: [
      'DOM (Document Object Model): Standardized by W3C. Represents the structured document tree of HTML/XML elements as nodes. Accessed via the window.document object (e.g., querySelector, createElement).',
      'BOM (Browser Object Model): Represents the browser application environment outside the document. Not strictly standardized, but universally implemented on the window object.',
      'BOM Components: window.navigator (device, browser info), window.location (current URL and routing), window.history (session history), window.screen (display metrics), and alert/confirm/prompt.',
      'Global Scope: In the browser, window is the top-level global object containing both BOM and DOM.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'dom-vs-bom.js',
      code: `// DOM: Interacting with HTML document elements
console.log(typeof document.title); // "string"

// BOM: Interacting with the browser environment
console.log(typeof window.navigator.userAgent); // "string"
console.log(typeof window.location.href);        // "string"
console.log(typeof window.history.length);       // "number"`,
      output: `string
string
string
number`,
      executionSteps: [
        { line: 2, explanation: 'document represents DOM document tree' },
        { line: 5, explanation: 'navigator, location, and history represent browser BOM APIs' }
      ]
    },
    keyPoints: [
      'DOM represents page content and HTML structure (document).',
      'BOM provides browser window controls and device APIs (window).',
      'window encapsulates document as a property.'
    ],
    interviewTip: 'In Next.js or SSR frameworks, BOM and DOM objects (window, document) are undefined on the server, requiring typeof window !== "undefined" guards.',
    tags: ['DOM', 'BOM', 'Browser APIs', 'Window']
  },
  {
    id: 'js-39',
    stack: 'javascript',
    topic: 'Browser DOM, BOM & Web APIs',
    title: 'Script Loading: Default vs. async vs. defer',
    difficulty: 'Intermediate',
    summary: 'Default <script>: Pauses HTML parsing while downloading and executing script files. async: Downloads in parallel; executes immediately upon arrival, pausing HTML parsing. Execution order is not preserved. defer: Downloads in parallel; runs only after HTML parsing completes. Preserves document script order.',
    explanation: [
      'Default <script>: Blocks HTML parsing. Browser stops DOM construction, downloads the script file over the network, executes it, and only then resumes HTML parsing.',
      'async: Non-blocking download in parallel with HTML parsing. As soon as download completes, it pauses HTML parsing immediately to execute. Execution order is NOT guaranteed (fastest download executes first).',
      'defer: Non-blocking parallel download. Does NOT execute until HTML parsing is fully complete (just before DOMContentLoaded). Execution order is strictly preserved according to document order.',
      'Recommendation: Use defer for application scripts with dependencies; use async for independent third-party utilities (analytics, tracking tags).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'script-loading.html',
      code: `<!-- Default: Blocks HTML parser during download & execution -->
<script src="legacy.js"></script>

<!-- Async: Parallel download, executes ASAP (order NOT guaranteed) -->
<script async src="analytics.js"></script>

<!-- Defer: Parallel download, executes after DOM ready (preserves order) -->
<script defer src="app.js"></script>`,
      output: `defer guarantees DOM is ready and maintains dependency order.`,
      executionSteps: [
        { line: 2, explanation: 'Default script pauses HTML parsing' },
        { line: 5, explanation: 'async downloads in background, executes immediately on finish' },
        { line: 8, explanation: 'defer downloads in background, executes after HTML parsing completes' }
      ]
    },
    keyPoints: [
      'default blocks HTML parsing during download and execution.',
      'async downloads in background and executes immediately (order not guaranteed).',
      'defer downloads in background and executes after HTML is parsed (order preserved).'
    ],
    interviewTip: 'Modern ES modules (<script type="module">) behave like defer by default!',
    tags: ['Scripts', 'Performance', 'defer', 'async', 'HTML']
  },
  {
    id: 'js-40',
    stack: 'javascript',
    topic: 'Browser DOM, BOM & Web APIs',
    title: 'localStorage vs. sessionStorage vs. Cookies',
    difficulty: 'Beginner',
    summary: 'localStorage: ~5–10MB capacity, persists until manually deleted, client-side only. sessionStorage: ~5MB capacity, cleared when the browser tab closes, client-side only. Cookies: ~4KB capacity, configured via expiration dates, sent automatically with every HTTP request header.',
    explanation: [
      'localStorage: Persistent key-value storage with ~5-10MB limit. Data survives browser restarts and has no expiration date; persists until cleared programmatically or by user.',
      'sessionStorage: Same API as localStorage, but data is tied to the current browser tab session. Closing the tab wipes the storage.',
      'Cookies: Small (~4KB) data storage. Can be configured with HttpOnly (inaccessible to JS, prevents XSS) and Secure flags. Sent automatically to the server on every HTTP request header.',
      'Scope: localStorage and Cookies are shared across all tabs with the same origin. sessionStorage is isolated to the specific tab.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'storage-comparison.js',
      code: `// 1. localStorage (persists across sessions)
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme")); // "dark"

// 2. sessionStorage (cleared when browser tab closes)
sessionStorage.setItem("activeTab", "step1");
console.log(sessionStorage.getItem("activeTab")); // "step1"

// 3. Cookies (sent with HTTP requests, small ~4KB)
document.cookie = "sessionId=xyz789; max-age=3600; path=/; SameSite=Strict";`,
      output: `dark
step1`,
      executionSteps: [
        { line: 2, explanation: 'localStorage persists across restarts' },
        { line: 6, explanation: 'sessionStorage scoped strictly to current browser tab' },
        { line: 10, explanation: 'Cookies configured with expiration and security policies' }
      ]
    },
    keyPoints: [
      'localStorage: ~5–10MB, persistent indefinitely.',
      'sessionStorage: ~5MB, cleared on tab close.',
      'Cookies: ~4KB, sent automatically to server on every HTTP request.'
    ],
    interviewTip: 'Never store sensitive JWT authentication tokens in localStorage due to XSS vulnerability; store them in HttpOnly cookies instead.',
    tags: ['localStorage', 'sessionStorage', 'Cookies', 'Web Storage', 'Security']
  },

  // ==========================================
  // Topic 9: Performance, Copying & Optimization
  // ==========================================
  {
    id: 'js-41',
    stack: 'javascript',
    topic: 'Performance, Copying & Optimization',
    title: 'Deep Copy vs. Shallow Copy',
    difficulty: 'Intermediate',
    summary: 'Shallow Copy: Clones only the top level; nested objects maintain original memory references ({...obj}, Object.assign()). Deep Copy: Clones all nested structures recursively: const deep = structuredClone(originalObj);',
    explanation: [
      'Shallow Copy: Creates a new outer object, but copies references for nested objects. Modifying shallow.nested.prop directly mutates original.nested.prop.',
      'Techniques for Shallow Copy: Spread operator ({ ...obj }, [ ...arr ]) or Object.assign({}, obj).',
      'Deep Copy: Creates completely new independent instances for every nested level. Modifying deep.nested.prop leaves original unaffected.',
      'Modern Deep Copy Standard: structuredClone(obj) is the native JavaScript standard (handles cyclic references, Maps, Sets, Dates). Avoid JSON.parse(JSON.stringify(obj)) as it loses undefined, functions, and Symbols.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'shallow-vs-deep-copy.js',
      code: `const original = { user: { name: "Alex" } };

// 1. Shallow copy with spread
const shallow = { ...original };
shallow.user.name = "Bob";
console.log(original.user.name); // "Bob" (Mutated nested reference!)

// 2. Deep copy with native structuredClone
const deep = structuredClone(original);
deep.user.name = "Charlie";
console.log(original.user.name); // "Bob" (Original safely intact!)`,
      output: `Bob
Bob`,
      executionSteps: [
        { line: 4, explanation: 'Shallow copy created; original and shallow share user memory pointer' },
        { line: 5, explanation: 'Mutating shallow.user.name alters shared original object' },
        { line: 9, explanation: 'structuredClone recursively copies all nested levels' },
        { line: 11, explanation: 'Original remains unaffected by deep mutation' }
      ]
    },
    keyPoints: [
      'Shallow copy copies references for nested objects.',
      'Deep copy recursively duplicates all levels of hierarchy.',
      'Use structuredClone() as the modern native standard for deep copying.'
    ],
    interviewTip: 'Mention why JSON.parse(JSON.stringify(obj)) is flawed: it drops undefined, functions, and symbols, and breaks on circular references.',
    tags: ['Deep Copy', 'Shallow Copy', 'structuredClone', 'Memory']
  },
  {
    id: 'js-42',
    stack: 'javascript',
    topic: 'Performance, Copying & Optimization',
    title: 'Debouncing Implementation',
    difficulty: 'Intermediate',
    summary: 'Delays execution until a quiet period has passed since the last event trigger.',
    explanation: [
      'Concept: Debouncing clusters multiple sequential calls into a single execution after a specified quiet delay has elapsed.',
      'Reset Timer: Every new invocation clears the previous timer using clearTimeout and restarts the countdown.',
      'Use Cases: Search autocomplete inputs, window resize handlers, auto-saving form drafts.',
      'Implementation: Uses closures to preserve the timer ID across function calls.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'debounce-implementation.js',
      code: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const logSearch = debounce(q => console.log("Search query:", q), 300);
logSearch("Re");
logSearch("React");
logSearch("React 19"); // Only this final call fires after 300ms!`,
      output: `Search query: React 19`,
      executionSteps: [
        { line: 1, explanation: 'debounce factory captures timer variable in closure' },
        { line: 9, explanation: 'Rapid calls clear existing timer and start fresh 300ms countdown' },
        { line: 12, explanation: 'Only the last invocation executes after 300ms of inactivity' }
      ]
    },
    keyPoints: [
      'Delays execution until a cooldown period with no calls.',
      'Clears and restarts the timer on every event trigger.',
      'Ideal for search inputs and typeahead queries.'
    ],
    interviewTip: 'Contrast debouncing with throttling: debounce waits for inactivity; throttle enforces a steady maximum execution rate.',
    tags: ['Debouncing', 'Performance', 'Closures', 'Machine Coding']
  },
  {
    id: 'js-43',
    stack: 'javascript',
    topic: 'Performance, Copying & Optimization',
    title: 'Throttling Implementation',
    difficulty: 'Intermediate',
    summary: 'Enforces that a function executes at most once in a given time interval.',
    explanation: [
      'Concept: Throttling ensures that a target function is called at a regular, controlled frequency, ignoring intermediate invocations during the interval.',
      'Flag Technique: Uses an inThrottle boolean flag captured in a closure. When true, further calls within the limit window are blocked.',
      'Timer Reset: After limit milliseconds, the flag is reset to false, allowing the next trigger to execute.',
      'Use Cases: Infinite scrolling, window scroll progress bars, mouse drag/move handlers, gaming tick loops.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'throttle-implementation.js',
      code: `function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const onScroll = throttle(() => console.log("Scroll tick"), 500);
onScroll(); // Fires immediately
onScroll(); // Ignored (within 500ms)`,
      output: `Scroll tick`,
      executionSteps: [
        { line: 1, explanation: 'throttle captures inThrottle flag in closure' },
        { line: 4, explanation: 'First call executes immediately and sets inThrottle = true' },
        { line: 7, explanation: 'Subsequent calls inside 500ms window are ignored' }
      ]
    },
    keyPoints: [
      'Executes at most once per specified time interval.',
      'Ignores intermediate invocations while in throttle cooldown.',
      'Ideal for scroll events and resize calculations.'
    ],
    interviewTip: 'Be prepared to explain leading-edge vs trailing-edge throttling in advanced machine coding interviews.',
    tags: ['Throttling', 'Performance', 'Closures', 'Machine Coding']
  },
  {
    id: 'js-44',
    stack: 'javascript',
    topic: 'Performance, Copying & Optimization',
    title: 'What is Memoization?',
    difficulty: 'Intermediate',
    summary: 'Caching function output for given inputs so repeated calls avoid expensive recalculations.',
    explanation: [
      'Concept: An optimization technique where the return value of a pure function is cached corresponding to its input arguments.',
      'Lookup: When the function is called with previously seen arguments, it returns the cached result in O(1) time instead of recomputing.',
      'Cache Key: Typically created using JSON.stringify(args) or Map keys.',
      'Pure Function Prerequisite: Only works safely with pure functions, since output must be deterministic for identical inputs.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'memoization-cache.js',
      code: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const square = memoize(n => {
  console.log("Computing...");
  return n * n;
});

console.log(square(5)); // Prints "Computing..." then 25
console.log(square(5)); // Returns 25 instantly from cache!`,
      output: `Computing...
25
25`,
      executionSteps: [
        { line: 2, explanation: 'Initializes Map cache within closure' },
        { line: 4, explanation: 'Generates serialized key from arguments' },
        { line: 5, explanation: 'Returns cached value immediately if present in cache' },
        { line: 7, explanation: 'Stores newly computed result in cache' }
      ]
    },
    keyPoints: [
      'Caches results of expensive pure function calculations.',
      'Provides O(1) instant return for previously encountered inputs.',
      'Forms the foundation of React.memo, useMemo, and reselect.'
    ],
    interviewTip: 'Mention memory trade-offs: unbounded caching can cause memory leaks. Production memoization libraries (like memoize-one or LRU cache) limit cache size.',
    tags: ['Memoization', 'Caching', 'Performance', 'Optimization']
  },

  // ==========================================
  // Topic 10: Tricky Output Predictions
  // ==========================================
  {
    id: 'js-45',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Microtask vs. Macrotask Execution Order',
    difficulty: 'Intermediate',
    summary: 'Synchronous code (1, 4) runs first. The resolved promise microtask (3) runs next before macrotasks, and the setTimeout callback (2) runs last.',
    explanation: [
      'Step 1: console.log(1) executes synchronously on the call stack -> logs 1.',
      'Step 2: setTimeout() schedules its callback to the Macrotask Queue.',
      'Step 3: Promise.resolve().then() schedules its callback to the Microtask Queue.',
      'Step 4: console.log(4) executes synchronously on the call stack -> logs 4.',
      'Step 5: Call stack clears. The event loop prioritizes draining the Microtask Queue -> logs 3.',
      'Step 6: Microtask queue is empty. The event loop pulls from the Macrotask Queue -> logs 2.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'tricky-event-loop.js',
      code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);

// Output: 1, 4, 3, 2`,
      output: `1
4
3
2`,
      executionSteps: [
        { line: 1, explanation: 'Synchronous log prints 1' },
        { line: 2, explanation: 'setTimeout queues callback to Macrotask Queue' },
        { line: 3, explanation: 'Promise.then queues callback to Microtask Queue' },
        { line: 4, explanation: 'Synchronous log prints 4' },
        { line: 3, explanation: 'Microtask drains: prints 3' },
        { line: 2, explanation: 'Macrotask executes: prints 2' }
      ]
    },
    keyPoints: [
      'Synchronous code always finishes before asynchronous queues are checked.',
      'Microtasks drain before macrotasks.',
      'Output is strictly: 1, 4, 3, 2.'
    ],
    interviewTip: 'A favorite interview variation: adding async/await functions into the mix. Awaiting a promise queues the code below the await into the microtask queue.',
    tags: ['Event Loop', 'Output Prediction', 'Async', 'Tricky']
  },
  {
    id: 'js-46',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Loop with var vs. let in setTimeout',
    difficulty: 'Intermediate',
    summary: 'var is function-scoped. By the time callbacks execute, the loop has completed with i = 3. Using let creates a distinct lexical binding per iteration, outputting 0, 1, 2.',
    explanation: [
      'Behavior with var: var i is hoisted to function/global scope. There is only one shared variable i in memory. By the time setTimeout callbacks execute after the loop completes, i has incremented to 3. All three callbacks reference this same i -> prints 3, 3, 3.',
      'Behavior with let: let is block-scoped. JavaScript creates a new lexical scope binding for each iteration of the loop, preserving the specific value of j for each callback -> prints 0, 1, 2.',
      'Pre-ES6 Fix: Before let, developers fixed this using an IIFE or bind to capture the current value of i.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'loop-var-vs-let.js',
      code: `// With var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 10);
}
// Output: var: 3, var: 3, var: 3

// With let:
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 10);
}
// Output: let: 0, let: 1, let: 2`,
      output: `var: 3
var: 3
var: 3
let: 0
let: 1
let: 2`,
      executionSteps: [
        { line: 2, explanation: 'var i increments to 3 before callbacks run' },
        { line: 8, explanation: 'let j creates a fresh binding per iteration (0, 1, 2)' }
      ]
    },
    keyPoints: [
      'var shares a single mutable binding across loop iterations.',
      'let creates a fresh lexical binding for each loop step.',
      'Classic question testing closures, scope, and asynchronous execution.'
    ],
    interviewTip: 'If asked to fix the var loop without using let, use an IIFE: (function(i) { setTimeout(...) })(i).',
    tags: ['Closures', 'var', 'let', 'Scope', 'Output Prediction']
  },
  {
    id: 'js-47',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Object Key Stringification Coercion',
    difficulty: 'Intermediate',
    summary: 'Plain object keys coerce to strings ("[object Object]"), meaning both assignments point to and overwrite the same key.',
    explanation: [
      'Object Key Rules: In standard JavaScript objects, property keys can only be strings or symbols. Non-string keys are implicitly converted to strings via String(key) or .toString().',
      'Object toString(): Plain objects b and c convert to "[object Object]" when used as property accessors.',
      'Overwriting: a[b] = 123 sets a["[object Object]"] = 123. Then a[c] = 456 sets the EXACT same key a["[object Object]"] = 456.',
      'Solution: If you need actual object references as keys, use Map instead of a plain object.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'object-key-coercion.js',
      code: `let a = {}, b = { key: "b" }, c = { key: "c" };

a[b] = 123; // a["[object Object]"] = 123
a[c] = 456; // a["[object Object]"] = 456 (overwrites previous!)

console.log(a[b]); // 456
console.log(Object.keys(a)); // ["[object Object]"]`,
      output: `456
[ '[object Object]' ]`,
      executionSteps: [
        { line: 3, explanation: 'b coerced to string "[object Object]"; key set to 123' },
        { line: 4, explanation: 'c also coerced to "[object Object]"; overwrites key to 456' },
        { line: 6, explanation: 'a[b] resolves to a["[object Object]"] which is 456' }
      ]
    },
    keyPoints: [
      'Object keys in plain objects are always coerced to strings (or symbols).',
      'String({ key: "b" }) evaluates to "[object Object]".',
      'Use Map if object references must be preserved as keys.'
    ],
    interviewTip: 'This question tests your understanding of property key coercion and why ES6 Map was introduced.',
    tags: ['Objects', 'Coercion', 'Output Prediction', 'Tricky']
  },
  {
    id: 'js-48',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Arithmetic Coercion Quirks',
    difficulty: 'Intermediate',
    summary: '"1" + 1 concatenates to "11". "A" - 1 evaluates to NaN. 2 + "-2" + "2" concatenates to "2-22". 0 == false and null == undefined evaluate to true under loose equality rules.',
    explanation: [
      '"1" + 1: The + operator encounters a string operand and coerces 1 to "1", resulting in string concatenation: "11".',
      '"A" - 1: The - operator enforces numeric conversion. Number("A") yields NaN, and NaN - 1 produces NaN.',
      '2 + "-2" + "2": Evaluates left-to-right: 2 + "-2" -> "2-2". Then "2-2" + "2" -> "2-22".',
      '0 == false: Boolean false is coerced to number 0; 0 == 0 evaluates to true.',
      'null == undefined: Per ECMAScript specification §7.2.14, null and undefined loosely equal each other and nothing else.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'coercion-quirks.js',
      code: `console.log("1" + 1);            // "11" (string concatenation)
console.log("A" - 1);            // NaN (failed numeric conversion)
console.log(2 + "-2" + "2");     // "2-22"
console.log(0 == false);         // true (loose coercion)
console.log(null == undefined);  // true (language specification rule)
console.log(null === undefined); // false (different types)`,
      output: `11
NaN
2-22
true
true
false`,
      executionSteps: [
        { line: 1, explanation: '+ operator concatenates strings' },
        { line: 2, explanation: '- operator attempts numeric conversion on "A", producing NaN' },
        { line: 3, explanation: 'Left-to-right evaluation results in "2-22"' },
        { line: 5, explanation: 'null loosely equals undefined by language specification rule' }
      ]
    },
    keyPoints: [
      '+ performs string concatenation if any operand is a string.',
      'Arithmetic operators (-, *, /) force numeric conversion.',
      'null == undefined is true; null === undefined is false.'
    ],
    interviewTip: 'Another quirk: typeof typeof 1. typeof 1 is "number", and typeof "number" is always "string"!',
    tags: ['Coercion', 'Operators', 'Output Prediction', 'Tricky']
  },
  {
    id: 'js-49',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Scope Shadowing in IIFEs',
    difficulty: 'Intermediate',
    summary: 'The inner var x declaration is hoisted to the top of the function scope as undefined, shadowing the global variable x.',
    explanation: [
      'Variable Shadowing: Declaring a variable inside an inner function with the same identifier as an outer variable shadows the outer variable.',
      'Function-Level Hoisting: Inside the IIFE, var x is hoisted to the top of the function scope and initialized to undefined.',
      'Execution: When console.log(x) executes on the first line of the IIFE, the engine finds the locally hoisted x, which has not yet been assigned 40.',
      'Result: It prints undefined instead of the global 20.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'scope-shadowing.js',
      code: `var x = 20;

(function() {
  console.log(x); // undefined (hoisted local var x shadows outer x!)
  var x = 40;
})();`,
      output: `undefined`,
      executionSteps: [
        { line: 1, explanation: 'Global var x initialized to 20' },
        { line: 5, explanation: 'Inner var x hoisted to top of function scope with undefined' },
        { line: 4, explanation: 'console.log(x) reads local hoisted undefined' }
      ]
    },
    keyPoints: [
      'Inner declarations shadow outer scope variables.',
      'var declarations are hoisted within their immediate function scope as undefined.',
      'Prints undefined rather than outer variable.'
    ],
    interviewTip: 'If var x = 40 were changed to let x = 40, accessing x before declaration would throw a ReferenceError due to the TDZ!',
    tags: ['Hoisting', 'Shadowing', 'IIFE', 'Scope', 'Tricky']
  },
  {
    id: 'js-50',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Method Reference Losing Execution Context',
    difficulty: 'Intermediate',
    summary: 'retrieve() is called as a detached standalone function, losing its implicit binding to user.',
    explanation: [
      'Detached Method Reference: Assigning user.getName to a variable (const retrieve = user.getName) extracts a reference to the function itself without binding context.',
      'Default Binding: When retrieve() is called, it is invoked as a plain function without any object before a dot.',
      'Result: this defaults to undefined (in strict mode) or window (in non-strict browser mode).',
      'Resolution: Preserve context by calling user.getName(), using an arrow wrapper (() => user.getName()), or binding with user.getName.bind(user).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'detached-context.js',
      code: `const user = {
  name: "Alex",
  getName() { return this.name; }
};

const retrieve = user.getName;
console.log(retrieve()); // undefined (or window.name in non-strict mode)

// Fix using bind:
const fixed = user.getName.bind(user);
console.log(fixed()); // "Alex"`,
      output: `undefined
Alex`,
      executionSteps: [
        { line: 6, explanation: 'retrieve holds raw function reference detached from user' },
        { line: 7, explanation: 'Called without context; this.name evaluates to undefined' },
        { line: 10, explanation: 'bind explicitly binds this to user' }
      ]
    },
    keyPoints: [
      'Extracting an object method to a variable detaches its this context.',
      'Invoking the extracted function falls back to default binding (undefined/window).',
      'Fix using .bind(object) or arrow functions.'
    ],
    interviewTip: 'This is the exact reason class components in early React needed this.handleClick = this.handleClick.bind(this) in the constructor.',
    tags: ['this', 'Context', 'Binding', 'Output Prediction']
  },
  {
    id: 'js-51',
    stack: 'javascript',
    topic: 'Tricky Output Predictions',
    title: 'Arrow Functions inside Object Literals',
    difficulty: 'Intermediate',
    summary: 'Arrow functions do not bind this to the calling object; they retain the enclosing global/module context.',
    explanation: [
      'Object Literal Scoping: An object literal ({ ... }) does NOT create a new lexical scope. The enclosing lexical scope is the module or global context.',
      'Arrow Function this: Arrow functions resolve this lexically from their outer enclosing scope. Since the outer scope is window/module, this?.val evaluates to undefined.',
      'Regular Method: regular() uses standard method invocation syntax where this is implicitly bound to obj -> returns 42.',
      'Best Practice: Never use arrow functions for object methods that need access to instance properties via this.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'arrow-in-object.js',
      code: `const obj = {
  val: 42,
  regular: function() { return this.val; },
  arrow: () => this?.val
};

console.log(obj.regular()); // 42
console.log(obj.arrow());   // undefined`,
      output: `42
undefined`,
      executionSteps: [
        { line: 7, explanation: 'obj.regular() called: this bound to obj, returns 42' },
        { line: 8, explanation: 'obj.arrow() called: arrow function has lexical this from outer scope, returns undefined' }
      ]
    },
    keyPoints: [
      'Object literals do not create a lexical scope.',
      'Arrow functions in object properties inherit this from the outer scope, not the object.',
      'Use standard method shorthand (method() {}) for object methods.'
    ],
    interviewTip: 'Remember: arrow functions are great for callbacks inside methods, but should NOT be used as the method declaration itself.',
    tags: ['Arrow Functions', 'this', 'Objects', 'Output Prediction']
  },

  // ==========================================
  // Topic 11: Machine Coding Challenges
  // ==========================================
  {
    id: 'js-52',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Check if Two Strings are Anagrams',
    difficulty: 'Intermediate',
    summary: 'Cleans non-alphanumeric characters, converts to lower-case, sorts the characters, and checks equality.',
    explanation: [
      'Definition: An anagram is a word or phrase formed by rearranging the letters of another word (e.g., "listen" -> "silent").',
      'Sanitization: Strips non-alphanumeric characters using regex /[^a-z0-9]/g and converts all characters to lower case.',
      'Sorting Approach: Splits each string into an array of characters, sorts them alphabetically, and joins them back. If sorted strings match, they are anagrams.',
      'Time Complexity: O(n log n) with the sorting approach; can be optimized to O(n) using a character frequency hash map.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'anagram-check.js',
      code: `function isAnagram(s1, s2) {
  const clean = str => str.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
  return clean(s1) === clean(s2);
}

console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("hello", "world"));   // false`,
      output: `true
false`,
      executionSteps: [
        { line: 1, explanation: 'Cleans and sorts both strings' },
        { line: 2, explanation: 'Compares sorted character sequences' },
        { line: 5, explanation: 'isAnagram("listen", "silent") evaluates to true' }
      ]
    },
    keyPoints: [
      'Cleans whitespace and punctuation before checking.',
      'Can be solved in O(n log n) using sorting or O(n) using character frequency maps.',
      'Popular interview question for string manipulation.'
    ],
    interviewTip: 'Offer the O(n) frequency map approach if the interviewer asks how to optimize large text strings.',
    tags: ['Strings', 'Algorithms', 'Anagram', 'Machine Coding']
  },
  {
    id: 'js-53',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Count Vowels in a String',
    difficulty: 'Beginner',
    summary: 'Matches the string against regex /[aeiou]/gi and returns the matched count or 0.',
    explanation: [
      'Regex Approach: Uses String.prototype.match() with a case-insensitive and global regex /[aeiou]/gi.',
      'Null Safety: If no vowels are present, match() returns null instead of an empty array. Using a ternary condition or nullish coalescing prevents TypeError.',
      'Iterative Alternative: Can also be solved using a Set of vowels (new Set(["a", "e", "i", "o", "u"])) and a for...of loop.',
      'Time Complexity: O(n) linear scan across string characters.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'count-vowels.js',
      code: `function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

console.log(countVowels("JavaScript")); // 3
console.log(countVowels("rhythm"));     // 0`,
      output: `3
0`,
      executionSteps: [
        { line: 2, explanation: 'Executes regex match for vowels globally and case-insensitively' },
        { line: 3, explanation: 'Returns matches.length if matched, else fallback to 0' },
        { line: 6, explanation: '"JavaScript" contains a, a, i -> 3 vowels' }
      ]
    },
    keyPoints: [
      'Uses /[aeiou]/gi for case-insensitive global matching.',
      'Safely handles strings with 0 vowels by guarding against null.',
      'Runs in O(n) time complexity.'
    ],
    interviewTip: 'Always mention handling the null return case from match() to demonstrate defensive programming.',
    tags: ['Regex', 'Strings', 'Counting', 'Beginner']
  },
  {
    id: 'js-54',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Rotate an Array to the Right by K Steps',
    difficulty: 'Intermediate',
    summary: 'Rotates array by k positions using array slice and concat operations.',
    explanation: [
      'Modulo Optimization: If k is larger than the array length, rotating k times is equivalent to rotating k % arr.length times.',
      'Slice & Concat: arr.slice(-steps) captures the tail elements that need to move to the front; arr.slice(0, -steps) captures the remaining front elements.',
      'Non-Mutating: Does not mutate the input array and returns a new rotated array.',
      'In-Place Alternative: Can also be performed in-place in O(n) time and O(1) space by reversing the whole array and then reversing both segments.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'rotate-array.js',
      code: `function rotateRight(arr, k) {
  if (!arr.length) return arr;
  const steps = k % arr.length;
  return arr.slice(-steps).concat(arr.slice(0, -steps));
}

console.log(rotateRight([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]`,
      output: `[ 4, 5, 1, 2, 3 ]`,
      executionSteps: [
        { line: 3, explanation: 'steps = 2 % 5 = 2' },
        { line: 4, explanation: 'slice(-2) extracts [4, 5]; slice(0, -2) extracts [1, 2, 3]' },
        { line: 7, explanation: 'Returns [4, 5, 1, 2, 3]' }
      ]
    },
    keyPoints: [
      'Calculates k % arr.length to prevent redundant full rotations.',
      'Uses slice(-steps).concat(slice(0, -steps)) for clean, readable code.',
      'O(n) time complexity.'
    ],
    interviewTip: 'Ask the interviewer if they require an in-place mutation or an immutable new array return before coding.',
    tags: ['Arrays', 'Algorithms', 'Rotation', 'Machine Coding']
  },
  {
    id: 'js-55',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Flatten a Deeply Nested Array',
    difficulty: 'Intermediate',
    summary: 'Recursively flattens multi-dimensional nested arrays using Array.prototype.reduce.',
    explanation: [
      'Recursive Reduction: Uses reduce with an initial empty array accumulator [].',
      'Array Detection: For each item, Array.isArray(item) checks whether the element is an array.',
      'Recursion: If it is an array, flattenArray is called recursively on it; otherwise, the item is concatenated directly.',
      'Built-in Alternative: Modern JavaScript supports arr.flat(Infinity), but interviewers specifically look for recursive or iterative manual implementations.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'flatten-array.js',
      code: `function flattenArray(arr) {
  return arr.reduce((acc, item) => 
    acc.concat(Array.isArray(item) ? flattenArray(item) : item), 
  []);
}

console.log(flattenArray([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]`,
      output: `[ 1, 2, 3, 4, 5 ]`,
      executionSteps: [
        { line: 2, explanation: 'reduce processes elements into an accumulated array' },
        { line: 3, explanation: 'Array.isArray(item) branches into recursive flattening' },
        { line: 7, explanation: 'Deeply nested array fully flattened to [1, 2, 3, 4, 5]' }
      ]
    },
    keyPoints: [
      'Recursively traverses nested arrays using Array.isArray.',
      'Manual implementation of Array.prototype.flat(Infinity).',
      'Commonly asked frontend machine coding challenge.'
    ],
    interviewTip: 'You can also implement this iteratively using a stack to prevent call stack overflow on extremely deep nesting.',
    tags: ['Recursion', 'Arrays', 'Flatten', 'Machine Coding']
  },
  {
    id: 'js-56',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Remove Duplicates from an Array',
    difficulty: 'Beginner',
    summary: 'Removes duplicate primitive elements from an array utilizing the ES6 Set data structure.',
    explanation: [
      'Set Data Structure: An ES6 Set only stores unique values. Passing an array with duplicate elements into new Set(arr) automatically discards duplicates.',
      'Spread Operator: Spreading the Set back into an array ([...new Set(arr)]) restores standard array formatting.',
      'Time Complexity: O(n) linear time, which is vastly faster than O(n^2) nested loops or filter with indexOf.',
      'Objects in Arrays: Note that Set uses SameValueZero comparison. Different object references with identical properties are considered distinct.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'remove-duplicates.js',
      code: `const removeDuplicates = arr => [...new Set(arr)];

console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
console.log(removeDuplicates(["a", "b", "a", "c"]));   // ["a", "b", "c"]`,
      output: `[ 1, 2, 3, 4, 5 ]
[ 'a', 'b', 'c' ]`,
      executionSteps: [
        { line: 1, explanation: 'new Set(arr) deduplicates array elements in O(n) time' },
        { line: 3, explanation: 'Spread converts Set back into a JavaScript array' }
      ]
    },
    keyPoints: [
      'Clean one-liner: [...new Set(arr)].',
      'O(n) time complexity.',
      'Deduplicates primitive numbers, strings, and booleans.'
    ],
    interviewTip: 'If deduplicating objects by a specific property (like id), use a Map or filter with a seen Set.',
    tags: ['Set', 'Arrays', 'Deduplication', 'ES6']
  },
  {
    id: 'js-57',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Find First Non-Repeating Character',
    difficulty: 'Intermediate',
    summary: 'Builds a frequency frequency map of characters and iterates to locate the first character with frequency equal to 1.',
    explanation: [
      'Two-Pass Algorithm: Pass 1 builds a frequency map counting occurrences of each character. Pass 2 iterates through the string characters in order to find the first one with a count of 1.',
      'Time Complexity: O(n) because each pass takes linear time.',
      'Space Complexity: O(k) where k is the number of distinct characters (bounded at 26 for lowercase English letters).',
      'Fallback: Returns null if all characters are repeating.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'first-non-repeating.js',
      code: `function firstNonRepeatingChar(str) {
  const counts = {};
  for (let ch of str) counts[ch] = (counts[ch] || 0) + 1;
  for (let ch of str) {
    if (counts[ch] === 1) return ch;
  }
  return null;
}

console.log(firstNonRepeatingChar("swiss")); // "w"
console.log(firstNonRepeatingChar("aabbcc")); // null`,
      output: `w
null`,
      executionSteps: [
        { line: 3, explanation: 'First loop counts frequencies: s: 3, w: 1, i: 1' },
        { line: 4, explanation: 'Second loop scans in order: s (3) skipped, w (1) matches!' },
        { line: 5, explanation: 'Returns "w"' }
      ]
    },
    keyPoints: [
      'Two-pass O(n) frequency map approach.',
      'Preserves original string order during second iteration.',
      'Returns null if no non-repeating character exists.'
    ],
    interviewTip: 'Avoid using str.indexOf(ch) === str.lastIndexOf(ch) inside a loop, as that results in O(n^2) quadratic time complexity!',
    tags: ['Strings', 'Hash Map', 'Algorithms', 'Machine Coding']
  },
  {
    id: 'js-58',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Binary Search on a Sorted Array',
    difficulty: 'Intermediate',
    summary: 'Performs O(log n) search on a sorted array by halving the search window each step.',
    explanation: [
      'Sorted Array Prerequisite: Binary search requires the input array to be pre-sorted in ascending order.',
      'Divide and Conquer: Maintains left and right pointers. Calculates the middle index (mid = Math.floor((left + right) / 2)).',
      'Halving: If arr[mid] === target, returns the index. If target is larger, search right half (left = mid + 1). If smaller, search left half (right = mid - 1).',
      'Time Complexity: O(log n) logarithmic time, dramatically faster than O(n) linear search for large datasets.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'binary-search.js',
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

console.log(binarySearch([2, 5, 8, 12, 16, 23], 12)); // 3
console.log(binarySearch([2, 5, 8, 12, 16, 23], 99)); // -1`,
      output: `3
-1`,
      executionSteps: [
        { line: 2, explanation: 'Initializes pointers: left = 0, right = 5' },
        { line: 4, explanation: 'mid = 2 (arr[2] = 8 < 12) -> left becomes 3' },
        { line: 5, explanation: 'mid = 4 (arr[4] = 16 > 12) -> right becomes 3' },
        { line: 5, explanation: 'mid = 3 (arr[3] = 12 === 12) -> returns index 3' }
      ]
    },
    keyPoints: [
      'Requires pre-sorted array.',
      'O(log n) time complexity, O(1) space complexity.',
      'Returns target index, or -1 if target is not found.'
    ],
    interviewTip: 'To avoid potential 32-bit integer overflow in other languages like Java/C++, developers write left + Math.floor((right - left) / 2).',
    tags: ['Binary Search', 'Algorithms', 'Sorted Arrays', 'Intermediate']
  },
  {
    id: 'js-59',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Check if a String is a Palindrome',
    difficulty: 'Beginner',
    summary: 'Uses a two-pointer approach comparing alphanumeric characters from start and end inward.',
    explanation: [
      'Definition: A palindrome is a word, phrase, or number that reads the same forwards and backwards (e.g. "A man, a plan, a canal: Panama").',
      'Sanitization: Normalizes string to lowercase and removes non-alphanumeric characters using regex /[^a-z0-9]/g.',
      'Two-Pointer Approach: Compares characters at left and right indices, incrementing left and decrementing right. If a mismatch is found, returns false immediately.',
      'Efficiency: Incurs zero extra memory allocation for reversing arrays, running in O(n) time and O(1) extra space.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'palindrome-check.js',
      code: `function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car"));                     // false`,
      output: `true
false`,
      executionSteps: [
        { line: 2, explanation: 'Cleans string to "amanaplanacanalpanama"' },
        { line: 4, explanation: 'Two pointers step inward comparing characters' },
        { line: 11, explanation: 'Evaluates to true' }
      ]
    },
    keyPoints: [
      'Sanitizes punctuation and whitespace before comparison.',
      'Two-pointer approach avoids array reversing overhead.',
      'O(n) time and O(1) space complexity.'
    ],
    interviewTip: 'Explain why two pointers are preferable to str.split("").reverse().join("") (which creates 3 intermediate objects in memory).',
    tags: ['Strings', 'Two Pointers', 'Palindrome', 'Machine Coding']
  },
  {
    id: 'js-60',
    stack: 'javascript',
    topic: 'Machine Coding Challenges',
    title: 'Reverse Words in a Sentence',
    difficulty: 'Beginner',
    summary: 'Splits the sentence by whitespace regex, reverses word order, and joins back with single spaces.',
    explanation: [
      'Trim: Trims leading and trailing whitespace using trim().',
      'Regex Splitting: Uses /\\s+/ to handle arbitrary amounts of whitespace (multiple spaces, tabs) between words.',
      'Reversal: Reverses the array of words with reverse() and joins them back with a single space.',
      'Output: Reverses the sequence of words without reversing the individual letters within each word.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'reverse-words.js',
      code: `function reverseWords(sentence) {
  return sentence.trim().split(/\\s+/).reverse().join(" ");
}

console.log(reverseWords("interview preparation javascript")); 
// "javascript preparation interview"

console.log(reverseWords("  blue   sky  ")); 
// "sky blue"`,
      output: `javascript preparation interview
sky blue`,
      executionSteps: [
        { line: 2, explanation: 'trim() removes outer whitespace; split(/\\s+/) splits on multiple spaces' },
        { line: 2, explanation: 'reverse() reverses word order and join(" ") connects with single space' },
        { line: 5, explanation: 'Prints "javascript preparation interview"' }
      ]
    },
    keyPoints: [
      'Uses /\\s+/ to handle multi-space padding gracefully.',
      'Reverses word order while keeping word letters intact.',
      'O(n) time complexity.'
    ],
    interviewTip: 'Using regex /\\s+/ instead of plain " " is the hallmark of a thorough candidate because real-world inputs often have inconsistent spaces.',
    tags: ['Strings', 'Reverse Words', 'Array Methods', 'Machine Coding']
  }
];
