import { TechStack } from '../types';

export interface PracticeQuestion {
  q: string;
  a: string;
}

export interface PracticeSection {
  id: string;
  title: string;
  questions: PracticeQuestion[];
}

export interface PracticeGroup {
  group: string;
  sections: PracticeSection[];
}

export const PRACTICE_DATA: Partial<Record<TechStack, PracticeGroup[]>> = {
  javascript: [
    {
    group: 'Phase 1 Questions',
    sections: [
      {
        id: 'console', title: 'Console & Basics', questions: [
          { q: 'Print `"Hello JavaScript"` in the console.', a: 'console.log("Hello JavaScript");' },
          { q: 'Print your name, age, and city using one `console.log()`.', a: 'console.log("Anubhav", 25, "Delhi");' },
          { q: 'Print a warning message using `console.warn()`.', a: 'console.warn("This is a warning!");' },
          { q: 'Print an error message using `console.error()`.', a: 'console.error("This is an error!");' },
          { q: 'Use `console.table()` to display an array of 5 numbers.', a: 'console.table([10, 20, 30, 40, 50]);' }
        ]
      },
      {
        id: 'variables', title: 'Variables', questions: [
          { q: 'Create a variable called `studentName` and store your name in it.', a: 'let studentName = "Anubhav";' },
          { q: 'Create a variable `age` and print it.', a: 'let age = 25;\nconsole.log(age);' },
          { q: 'Create two variables and swap their values.', a: 'let a = 10, b = 20;\nlet temp = a;\na = b;\nb = temp;\nconsole.log(a, b);' },
          { q: 'Try re-assigning a `const` variable and observe the error.', a: 'const gravity = 9.8;\ngravity = 10; // TypeError: Assignment to constant variable.' },
          { q: 'Check the data type of `"100"` using `typeof`.', a: 'console.log(typeof "100"); // "string"' }
        ]
      },
      {
        id: 'datatypes', title: 'Data Types', questions: [
          { q: 'Create a boolean variable `isJavaScriptFun` and set it to `true`.', a: 'let isJavaScriptFun = true;' },
          { q: 'Create an array of 3 fruits.', a: 'let fruits = ["Apple", "Banana", "Mango"];' },
          { q: 'Create an object representing a car (brand, model, year).', a: 'let car = {\n  brand: "Toyota",\n  model: "Corolla",\n  year: 2020\n};' },
          { q: 'What is the output of `typeof null`?', a: 'console.log(typeof null); // "object" (This is a known JavaScript bug)' },
          { q: 'Create an undefined variable and print its type.', a: 'let someVar;\nconsole.log(typeof someVar); // "undefined"' }
        ]
      },
      {
        id: 'operators', title: 'Operators', questions: [
          { q: 'Add two numbers 10 and 20.', a: 'console.log(10 + 20); // 30' },
          { q: 'Find the remainder when 15 is divided by 4.', a: 'console.log(15 % 4); // 3' },
          { q: 'What is the difference between `==` and `===`? (Write code to prove).', a: 'console.log(5 == "5");  // true (only checks value)\nconsole.log(5 === "5"); // false (checks value AND type)' },
          { q: 'Check if 10 is greater than 5 AND less than 20.', a: 'console.log(10 > 5 && 10 < 20); // true' },
          { q: 'Check if 10 is equal to 10 OR 20 is equal to 30.', a: 'console.log(10 === 10 || 20 === 30); // true' }
        ]
      },
      {
        id: 'conditions', title: 'Conditions (if-else)', questions: [
          { q: 'Write a program to check if a person can vote (age >= 18).', a: 'let age = 20;\nif (age >= 18) {\n  console.log("Eligible to vote");\n} else {\n  console.log("Not eligible");\n}' },
          { q: 'Check whether a given number is Even or Odd.', a: 'let num = 7;\nif (num % 2 === 0) {\n  console.log("Even");\n} else {\n  console.log("Odd");\n}' },
          { q: 'Write a program to print positive, negative, or zero.', a: 'let val = -5;\nif (val > 0) console.log("Positive");\nelse if (val < 0) console.log("Negative");\nelse console.log("Zero");' },
          { q: 'Use ternary operator to check if a number is even.', a: 'let n = 10;\nlet result = (n % 2 === 0) ? "Even" : "Odd";\nconsole.log(result);' },
          { q: 'Use `switch-case` to print the day of the week (1=Monday...7=Sunday).', a: 'let day = 3;\nswitch(day) {\n  case 1: console.log("Monday"); break;\n  case 2: console.log("Tuesday"); break;\n  case 3: console.log("Wednesday"); break;\n  default: console.log("Other day");\n}' }
        ]
      },
      {
        id: 'loops', title: 'Loops (for, while)', questions: [
          { q: 'Print numbers from 1 to 10 using a `for` loop.', a: 'for (let i = 1; i <= 10; i++) {\n  console.log(i);\n}' },
          { q: 'Print numbers from 10 to 1 using a `while` loop.', a: 'let i = 10;\nwhile (i > 0) {\n  console.log(i);\n  i--;\n}' },
          { q: 'Print the multiplication table of 5.', a: 'for (let i = 1; i <= 10; i++) {\n  console.log(`5 x ${i} = ${5 * i}`);\n}' },
          { q: 'Use a `for` loop to calculate the sum of numbers from 1 to 100.', a: 'let sum = 0;\nfor (let i = 1; i <= 100; i++) {\n  sum += i;\n}\nconsole.log(sum);' },
          { q: 'Print all even numbers between 1 and 20.', a: 'for (let i = 1; i <= 20; i++) {\n  if (i % 2 === 0) console.log(i);\n}' }
        ]
      },
      {
        id: 'functions', title: 'Functions', questions: [
          { q: 'Create a function that says "Hello World".', a: 'function greet() {\n  console.log("Hello World");\n}\ngreet();' },
          { q: 'Create a function `add(a, b)` that returns the sum of two numbers.', a: 'function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 10));' },
          { q: 'Convert the `add` function into an Arrow Function.', a: 'const add = (a, b) => a + b;\nconsole.log(add(5, 10));' },
          { q: 'Write a function that accepts a name and returns `"Welcome, [name]!"`.', a: 'const welcome = (name) => `Welcome, ${name}!`;\nconsole.log(welcome("Anubhav"));' },
          { q: 'Write a function to find the square of a number.', a: 'const square = (n) => n * n;\nconsole.log(square(4)); // 16' }
        ]
      },
      {
        id: 'strings', title: 'String Methods', questions: [
          { q: 'Find the length of the string `"JavaScript"`.', a: 'console.log("JavaScript".length); // 10' },
          { q: 'Convert `"hello"` to uppercase.', a: 'console.log("hello".toUpperCase()); // "HELLO"' },
          { q: 'Extract `"Script"` from `"JavaScript"` using `.slice()`.', a: 'console.log("JavaScript".slice(4)); // "Script"' },
          { q: 'Replace `"bad"` with `"good"` in `"This is bad"`.', a: 'let str = "This is bad";\nconsole.log(str.replace("bad", "good"));' },
          { q: 'Split the sentence `"I love coding"` into an array of words.', a: 'let str = "I love coding";\nconsole.log(str.split(" ")); // ["I", "love", "coding"]' }
        ]
      },
      {
        id: 'arrays', title: 'Array Methods', questions: [
          { q: 'Create an array of numbers and print the first element.', a: 'let arr = [10, 20, 30];\nconsole.log(arr[0]); // 10' },
          { q: 'Add `"Mango"` to the end of an array.', a: 'let fruits = ["Apple"];\nfruits.push("Mango");\nconsole.log(fruits);' },
          { q: 'Remove the first element from an array.', a: 'let arr = [1, 2, 3];\narr.shift();\nconsole.log(arr); // [2, 3]' },
          { q: 'Find the index of `"Blue"` in `["Red", "Blue", "Green"]`.', a: 'let colors = ["Red", "Blue", "Green"];\nconsole.log(colors.indexOf("Blue")); // 1' },
          { q: 'Use `.join()` to convert `["A", "B", "C"]` into `"A-B-C"`.', a: 'let arr = ["A", "B", "C"];\nconsole.log(arr.join("-")); // "A-B-C"' }
        ]
      },
      {
        id: 'objects', title: 'Objects', questions: [
          { q: 'Create an object `user` with `name`, `age`. Print `name`.', a: 'let user = { name: "Rahul", age: 25 };\nconsole.log(user.name);' },
          { q: 'Add a new property `city: "Delhi"` to the `user` object.', a: 'user.city = "Delhi";\nconsole.log(user);' },
          { q: 'Delete the `age` property from `user`.', a: 'delete user.age;\nconsole.log(user);' },
          { q: 'Check if `email` exists in `user`.', a: 'console.log("email" in user); // false' },
          { q: 'Extract keys of an object using `Object.keys()`.', a: 'console.log(Object.keys(user)); // ["name", "city"]' }
        ]
      },
      {
        id: 'dom', title: 'DOM Basics (Browser Only)', questions: [
          { q: 'Select an element with `id="heading"` and change its text to "Welcome".', a: 'document.getElementById("heading").innerText = "Welcome";' },
          { q: 'Select all `<p>` tags and print their count.', a: 'let paras = document.querySelectorAll("p");\nconsole.log(paras.length);' },
          { q: 'Create a new `<button>` element and append it to the body.', a: 'let btn = document.createElement("button");\nbtn.innerText = "Click Me";\ndocument.body.appendChild(btn);' },
          { q: 'Change the background color of the body to blue.', a: 'document.body.style.backgroundColor = "blue";' },
          { q: 'Add a click event listener to a button that shows an alert.', a: 'document.querySelector("button").addEventListener("click", () => {\n  alert("Button clicked!");\n});' }
        ]
      },
      {
        id: 'math', title: 'Math & Dates', questions: [
          { q: 'Generate a random number between 1 and 10.', a: 'console.log(Math.floor(Math.random() * 10) + 1);' },
          { q: 'Find the maximum of 10, 45, 3, 78.', a: 'console.log(Math.max(10, 45, 3, 78)); // 78' },
          { q: 'Print the current Date and Time.', a: 'console.log(new Date());' },
          { q: 'Get only the current year from a Date object.', a: 'console.log(new Date().getFullYear());' },
          { q: 'Round `4.7` to the nearest integer.', a: 'console.log(Math.round(4.7)); // 5' }
        ]
      },
      {
        id: 'es6', title: 'ES6+ Basics', questions: [
          { q: 'Destructure `name` and `age` from an object.', a: 'const obj = { name: "Aman", age: 22 };\nconst { name, age } = obj;\nconsole.log(name, age);' },
          { q: 'Extract the first two elements of an array using destructuring.', a: 'const arr = [10, 20, 30];\nconst [first, second] = arr;\nconsole.log(first, second);' },
          { q: 'Merge two arrays `[1, 2]` and `[3, 4]` using the Spread operator.', a: 'const a1 = [1, 2];\nconst a2 = [3, 4];\nconst merged = [...a1, ...a2];\nconsole.log(merged); // [1, 2, 3, 4]' },
          { q: 'Create a template literal string printing `"Hello, my name is [name]"`.', a: 'let name = "Anubhav";\nconsole.log(`Hello, my name is ${name}`);' },
          { q: 'Write a function using the Rest operator to accept any number of arguments.', a: 'function sumAll(...args) {\n  return args.reduce((acc, val) => acc + val, 0);\n}\nconsole.log(sumAll(1, 2, 3, 4)); // 10' }
        ]
      }
    ]
  },
  {
    group: 'Phase 2 Questions - Sheet 1',
    sections: [
      {
        id: 'p2-s1-beginner', title: 'Functions Basics - Beginner', questions: [
          { q: 'Create a function named `greet` that prints `"Hello World"`.', a: 'function greet() {\n  console.log("Hello World");\n}\ngreet();' },
          { q: 'Create a function `add(a, b)` that returns the sum.', a: 'function add(a, b) {\n  return a + b;\n}' },
          { q: 'Write a function to calculate the square of a number.', a: 'function square(n) {\n  return n * n;\n}' },
          { q: 'Create a function that checks whether a number is even or odd.', a: 'function isEven(n) {\n  return n % 2 === 0 ? "Even" : "Odd";\n}' },
          { q: 'Write a function that converts Celsius to Fahrenheit.', a: 'function toFahrenheit(c) {\n  return (c * 9/5) + 32;\n}' },
          { q: 'Create a function with default parameter `"Guest"`.', a: 'function welcome(name = "Guest") {\n  console.log("Welcome", name);\n}' },
          { q: 'Write a function that returns the greater of two numbers.', a: 'function getMax(a, b) {\n  return a > b ? a : b;\n}' },
          { q: 'Create a function to calculate area of rectangle.', a: 'function rectArea(w, h) {\n  return w * h;\n}' },
          { q: 'Write a function that returns `"Adult"` if age >= 18 else `"Minor"`.', a: 'function checkAge(age) {\n  return age >= 18 ? "Adult" : "Minor";\n}' },
          { q: 'Create a function to reverse a string.', a: 'function reverseStr(s) {\n  return s.split("").reverse().join("");\n}' }
        ]
      },
      {
        id: 'p2-s1-inter', title: 'Functions Basics - Intermediate', questions: [
          { q: 'Write a function expression for multiplication.', a: 'const multiply = function(a, b) {\n  return a * b;\n};' },
          { q: 'Convert a normal function into an arrow function.', a: '// Normal: function hi() { return "Hi"; }\nconst hi = () => "Hi";' },
          { q: 'Create a function that accepts unlimited numbers and returns their sum using rest operator.', a: 'function sum(...nums) {\n  return nums.reduce((acc, curr) => acc + curr, 0);\n}' },
          { q: 'Write a function that counts vowels in a string.', a: 'function countVowels(s) {\n  const vowels = "aeiouAEIOU";\n  return s.split("").filter(c => vowels.includes(c)).length;\n}' }
        ]
      }
    ]
  },
  {
    group: 'Phase 2 Questions - Sheet 2',
    sections: [
      {
        id: 'p2-s2-arrays', title: 'Arrays - Intermediate & Hard', questions: [
          { q: 'Create an array of 5 favorite movies and print all values. (Hint: Use indexing)', a: 'let movies = ["Inception", "Interstellar", "Batman", "Dunkirk", "Tenet"];\nconsole.log(movies[0], movies[1], movies[2], movies[3], movies[4]);' },
          { q: 'Create an array containing numbers, strings, boolean, and another array. Print only the nested array value.', a: 'let mixed = [1, "two", true, [4, 5]];\nconsole.log(mixed[3]);' },
          { q: 'Print the first and last element of an array. (Hint: Use `0` and `length - 1`)', a: 'let arr = [10, 20, 30];\nconsole.log(arr[0], arr[arr.length - 1]);' },
          { q: 'Swap the second and second-last element using indexing. (Hint: Use temporary variable)', a: 'let arr = [1, 2, 3, 4, 5];\nlet temp = arr[1];\narr[1] = arr[arr.length - 2];\narr[arr.length - 2] = temp;\nconsole.log(arr);' }
        ]
      },
      {
        id: 'p2-s2-multi', title: 'Multi-Dimensional Arrays', questions: [
          { q: 'Create a 2D array and print all first elements of inner arrays.', a: 'let matrix = [[1, 2], [3, 4], [5, 6]];\nfor(let row of matrix) {\n  console.log(row[0]);\n}' },
          { q: 'Find the sum of all diagonal elements in a 3x3 matrix.', a: 'let m = [[1,2,3], [4,5,6], [7,8,9]];\nlet sum = m[0][0] + m[1][1] + m[2][2];\nconsole.log(sum);' }
        ]
      },
      {
        id: 'p2-s2-length', title: 'Length Property', questions: [
          { q: 'Find total elements in an array without counting manually.', a: 'let arr = [1, 2, 3, 4, 5];\nconsole.log(arr.length);' },
          { q: 'Create an array of 100 elements using length and fill it with `0`. (Hint: Use `Array(n).fill(val)`)', a: 'let arr = Array(100).fill(0);\nconsole.log(arr);' }
        ]
      }
    ]
  },
  {
    group: 'Phase 2 Questions - Sheet 3',
    sections: [
      {
        id: 'p2-s3-foreach', title: 'Array Iteration - forEach()', questions: [
          { q: 'You are given an array of prices: `[100, 250, 399, 499]`. Print each price with `"₹"` before it.', a: 'let prices = [100, 250, 399, 499];\nprices.forEach(p => console.log(`₹${p}`));' },
          { q: 'You are given an array of students (objects with name and marks). Print `"Pass"` if marks are > 50, else `"Fail"`. Output: `Anubhav - Pass`', a: 'let students = [{ name: "Anubhav", marks: 85 }, { name: "Rahul", marks: 42 }];\nstudents.forEach(s => {\n  console.log(`${s.name} - ${s.marks > 50 ? "Pass" : "Fail"}`);\n});' }
        ]
      },
      {
        id: 'p2-s3-map', title: 'Array Iteration - map()', questions: [
          { q: 'Convert all names in `["anubhav", "rahul", "aman"]` into uppercase using `.map()`.', a: 'let names = ["anubhav", "rahul", "aman"];\nlet upper = names.map(n => n.toUpperCase());\nconsole.log(upper);' },
          { q: 'Add `18%` GST to an array of prices using `.map()` and return the new array.', a: 'let prices = [100, 200, 300];\nlet withGST = prices.map(p => p + (p * 0.18));\nconsole.log(withGST);' }
        ]
      },
      {
        id: 'p2-s3-filter', title: 'Array Iteration - filter()', questions: [
          { q: 'Filter out only positive numbers from `[-10, 20, -5, 50, 0]`.', a: 'let nums = [-10, 20, -5, 50, 0];\nlet positive = nums.filter(n => n > 0);\nconsole.log(positive);' },
          { q: 'Filter out students who scored more than 80 marks.', a: 'let students = [{name:"A", marks:90}, {name:"B", marks:40}];\nlet top = students.filter(s => s.marks > 80);\nconsole.log(top);' }
        ]
      },
      {
        id: 'p2-s3-reduce', title: 'Array Iteration - reduce()', questions: [
          { q: 'Find the total sum of an array using `.reduce()`.', a: 'let nums = [10, 20, 30];\nlet sum = nums.reduce((acc, curr) => acc + curr, 0);\nconsole.log(sum);' },
          { q: 'Find the maximum number in an array using `.reduce()`.', a: 'let nums = [5, 100, 20, 1];\nlet max = nums.reduce((acc, curr) => curr > acc ? curr : acc, nums[0]);\nconsole.log(max);' }
        ]
      }
    ]
  },
  {
    group: 'Phase 2 Questions - Sheet 4',
    sections: [
      {
        id: 'p2-s4-objects', title: 'Objects Basics', questions: [
          { q: 'Create an object for a student with `name`, `age`, `course`. Then print all values.', a: 'let s = { name: "Aman", age: 20, course: "BCA" };\nconsole.log(s.name, s.age, s.course);' },
          { q: 'Access properties `brand` and `model` using both dot notation and bracket notation from `{brand:"BMW", model:"M4"}`.', a: 'let car = { brand: "BMW", model: "M4" };\nconsole.log(car.brand, car["model"]);' },
          { q: 'Change the age of a user from 20 to 25.', a: 'let user = { age: 20 };\nuser.age = 25;\nconsole.log(user);' },
          { q: 'Add a new property `isAdmin: true` to an object.', a: 'let user = {};\nuser.isAdmin = true;' },
          { q: 'Remove the `password` property from `{username: "john", password: "123"}`.', a: 'let acc = { username: "john", password: "123" };\ndelete acc.password;' }
        ]
      },
      {
        id: 'p2-s4-methods', title: 'Object Methods', questions: [
          { q: 'Write a function that returns how many properties an object has.', a: 'function countProps(obj) {\n  return Object.keys(obj).length;\n}' },
          { q: 'Use `Object.keys()` to print all keys of an object.', a: 'let obj = { a: 1, b: 2 };\nconsole.log(Object.keys(obj));' },
          { q: 'Use `Object.values()` to print all values of an object.', a: 'let obj = { a: 1, b: 2 };\nconsole.log(Object.values(obj));' },
          { q: 'Use `Object.entries()` to print key-value pairs.', a: 'let obj = { a: 1, b: 2 };\nconsole.log(Object.entries(obj));' }
        ]
      }
    ]
  },
  {
    group: 'JavaScript Practice Task (Beginner Friendly)',
    sections: [
      {
        id: 'beginner-functions', title: 'Part 1: Variables, Functions & Conditions', questions: [
          { q: 'Q1. Create a function that returns the sum of two numbers. Example: `add(10, 20); // Output: 30`', a: 'const add = (a, b) => a + b;\nconsole.log(add(10, 20));' },
          { q: 'Q2. Create a function that returns the square of a number. Example: `square(5); // Output: 25`', a: 'const square = (n) => n * n;\nconsole.log(square(5));' },
          { q: 'Q3. Create a function that checks whether a number is Even or Odd. Example: `checkEvenOdd(7); // Output: Odd`', a: 'const checkEvenOdd = (n) => n % 2 === 0 ? "Even" : "Odd";\nconsole.log(checkEvenOdd(7));' },
          { q: 'Q4. Create a function that returns the larger number among two numbers. Example: `max(10, 20); // Output: 20`', a: 'const max = (a, b) => a > b ? a : b;\nconsole.log(max(10, 20));' },
          { q: 'Q5. Create a function that checks if a person is eligible to vote. Example: `isEligible(18); // Output: Eligible`', a: 'const isEligible = (age) => age >= 18 ? "Eligible" : "Not Eligible";\nconsole.log(isEligible(18));' }
        ]
      },
      {
        id: 'beginner-loops', title: 'Part 2: Loops', questions: [
          { q: 'Q6. Print numbers from 1 to 50 using a loop.', a: 'for(let i=1; i<=50; i++) console.log(i);' },
          { q: 'Q7. Print all even numbers between 1 and 100.', a: 'for(let i=1; i<=100; i++) if(i%2===0) console.log(i);' },
          { q: 'Q8. Find the sum of numbers from 1 to 100. Output: `5050`', a: 'let sum = 0;\nfor(let i=1; i<=100; i++) sum += i;\nconsole.log(sum);' },
          { q: 'Q9. Print the multiplication table of a number. Example: `table(5);`', a: 'function table(n) {\n  for(let i=1; i<=10; i++) console.log(`${n} x ${i} = ${n*i}`);\n}' },
          { q: 'Q10. Count how many digits are present in a number. Example: `countDigits(12345); // Output: 5`', a: 'const countDigits = (n) => String(n).length;\nconsole.log(countDigits(12345));' }
        ]
      },
      {
        id: 'beginner-strings', title: 'Part 3: Strings', questions: [
          { q: 'Q11. Reverse a string. Example: `reverseString("hello"); // Output: olleh`', a: 'const reverseString = (s) => s.split("").reverse().join("");' },
          { q: 'Q12. Count vowels in a string. Example: `countVowels("javascript"); // Output: 3`', a: 'const countVowels = (s) => s.match(/[aeiou]/gi)?.length || 0;' },
          { q: 'Q13. Check whether a string is a palindrome. Example: `isPalindrome("madam"); // Output: true`', a: 'const isPalindrome = (s) => s === s.split("").reverse().join("");' },
          { q: 'Q14. Convert the first letter of every word to uppercase. Example: `capitalize("hello world"); // Output: Hello World`', a: 'const capitalize = (s) => s.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");' },
          { q: 'Q15. Count how many times a character appears in a string. Example: `countChar("javascript", "a"); // Output: 2`', a: 'const countChar = (str, char) => str.split(char).length - 1;' }
        ]
      },
      {
        id: 'beginner-arrays', title: 'Part 4: Arrays', questions: [
          { q: 'Q16. Find the largest number in an array. `[10, 20, 30, 40, 50]` Output: `50`', a: 'const maxInArr = (arr) => Math.max(...arr);' },
          { q: 'Q17. Find the smallest number in an array. `[10, 20, 30, 40, 50]` Output: `10`', a: 'const minInArr = (arr) => Math.min(...arr);' },
          { q: 'Q18. Find the sum of all array elements. `[1,2,3,4,5]` Output: `15`', a: 'const sumArr = (arr) => arr.reduce((a, b) => a + b, 0);' },
          { q: 'Q19. Return only even numbers from an array. `[1,2,3,4,5,6]` Output: `[2,4,6]`', a: 'const getEvens = (arr) => arr.filter(n => n % 2 === 0);' },
          { q: 'Q20. Remove duplicate values from an array. `[1,2,2,3,4,4,5]` Output: `[1,2,3,4,5]`', a: 'const removeDupes = (arr) => [...new Set(arr)];' }
        ]
      },
      {
        id: 'beginner-bonus', title: 'Bonus Task', questions: [
          { q: 'Build a **Student Marks Calculator**. Input: `[50, 60, 70, 80, 90]`. Output: `Highest, Lowest, Average, Total`', a: 'function marksCalc(arr) {\n  let total = arr.reduce((a, b) => a + b, 0);\n  console.log(`Highest: ${Math.max(...arr)}`);\n  console.log(`Lowest: ${Math.min(...arr)}`);\n  console.log(`Average: ${total / arr.length}`);\n  console.log(`Total: ${total}`);\n}' }
        ]
      }
    ]
  },
  {
    group: 'JavaScript Advanced Concepts',
    sections: [
      {
        id: 'adv-this', title: '1️⃣ The `this` Keyword', questions: [
          { q: 'Problem 1: Global vs Function `this`. Create a function `showThis()` and print the value of `this` when called normally and in strict mode.', a: 'function showThis() {\n  console.log(this);\n}\nshowThis(); // Window or global\n\nfunction strictThis() {\n  "use strict";\n  console.log(this);\n}\nstrictThis(); // undefined' },
          { q: 'Problem 2: Object Method Context. Create `const user = { name: "Anubhav" };`. Add a method that prints `Hello Anubhav`. Then store the method in another variable and call it.', a: 'const user = {\n  name: "Anubhav",\n  sayHi() { console.log("Hello", this.name); }\n};\nuser.sayHi(); // Hello Anubhav\nconst unbound = user.sayHi;\nunbound(); // Hello undefined' },
          { q: 'Problem 3: Arrow Function vs Regular Function. Create an object with `name: "Rahul"`. Implement one regular method and one arrow method. Print `this.name` from both.', a: 'const obj = {\n  name: "Rahul",\n  reg() { console.log(this.name); },\n  arr: () => { console.log(this.name); } // Arrow inherits from global\n};\nobj.reg(); // Rahul\nobj.arr(); // undefined' },
          { q: 'Problem 4: Nested Callback Problem. Create `{ name: "Rahul", hobbies: ["Coding", "Gaming"] }`. Print `"Rahul likes Coding"` etc., without storing `this` in another variable.', a: 'const p = {\n  name: "Rahul",\n  hobbies: ["Coding", "Gaming"],\n  show() {\n    this.hobbies.forEach(h => console.log(`${this.name} likes ${h}`)); // Arrow preserves `this`\n  }\n};\np.show();' },
          { q: 'Problem 5: Event Handler Simulation. Create an object representing a button. Write one regular function handler and one arrow function handler.', a: 'const btn = {\n  id: "Submit",\n  clickReg: function() { console.log(this.id); },\n  clickArr: () => { console.log(this.id); }\n};\nbtn.clickReg(); // Submit\nbtn.clickArr(); // undefined' }
        ]
      },
      {
        id: 'adv-call-apply-bind', title: '2️⃣ call(), apply(), bind()', questions: [
          { q: 'Problem 6: Borrow a Method using call(). Create `person1 = { name: "A" }` and `person2 = { name: "B" }`. Create a method that introduces a person and use `call()` to borrow it.', a: 'function intro() { console.log("Hi, I am", this.name); }\nconst p1 = { name: "Anubhav" };\nconst p2 = { name: "Rahul" };\nintro.call(p1);\nintro.call(p2);' },
          { q: 'Problem 7: apply() with Array Arguments. Create a function `introduce(city, country)`. Pass values using `apply()`.', a: 'function intro(city, country) {\n  console.log(`I am from ${city}, ${country}`);\n}\nintro.apply(null, ["Indore", "India"]);' },
          { q: 'Problem 8: bind() for Delayed Execution. Create a function that prints a user\'s name after 2 seconds using `setTimeout()` and `bind()`.', a: 'const u = { name: "John" };\nfunction sayName() { console.log(this.name); }\nsetTimeout(sayName.bind(u), 2000);' },
          { q: 'Problem 9: Custom Calculator. Create `{ value: 100 }`. Create a function that adds numbers to `value`. Use `call()`, `apply()`, and `bind()` to execute it.', a: 'const calc = { value: 100 };\nfunction add(amt) { this.value += amt; }\nadd.call(calc, 10);\nadd.apply(calc, [20]);\nconst addLater = add.bind(calc);\naddLater(30);\nconsole.log(calc.value); // 160' }
        ]
      },
      {
        id: 'adv-prototypes', title: '3️⃣ Prototypes', questions: [
          { q: 'Problem 10: Prototype Lookup. Create `const person = { name: "Rahul" };`. Check whether `person.hasOwnProperty("name")` comes from the object itself or its prototype.', a: 'const person = { name: "Rahul" };\nconsole.log(person.hasOwnProperty("name")); // true (comes from Object.prototype)' },
          { q: 'Problem 11: Create a Custom Prototype Method. Add a method to `Array.prototype` called `sum()`.', a: 'Array.prototype.sum = function() {\n  return this.reduce((a,b) => a+b, 0);\n};\nconsole.log([1,2,3,4].sum()); // 10' },
          { q: 'Problem 12: Object.create(). Create `animal` object containing `eat()`. Create a `dog` object using `Object.create()` and access inherited methods.', a: 'const animal = { eat() { console.log("Eating"); } };\nconst dog = Object.create(animal);\ndog.eat();' },
          { q: 'Problem 13: Prototype Inheritance. Create `vehicle`. Create `car`, `bike` using prototype inheritance. Each should inherit `start()`.', a: 'const vehicle = { start() { console.log("Vroom"); } };\nconst car = Object.create(vehicle);\ncar.start();' },
          { q: 'Problem 14: Constructor Function + Prototype. Create a constructor `Person` that accepts `name`, `age`. Add a method using `Person.prototype.greet`.', a: 'function Person(name, age) {\n  this.name = name;\n  this.age = age;\n}\nPerson.prototype.greet = function() { console.log("Hi", this.name); };\nconst p = new Person("Rahul", 20);\np.greet();' },
          { q: 'Problem 15: Prototype Chain Investigation. Create `const arr = [];`. Print `arr.__proto__`, `arr.__proto__.__proto__`. Explain the output.', a: 'const arr = [];\nconsole.log(arr.__proto__); // Array.prototype\nconsole.log(arr.__proto__.__proto__); // Object.prototype\nconsole.log(arr.__proto__.__proto__.__proto__); // null' }
        ]
      },
      {
        id: 'adv-classes', title: '4️⃣ ES6 Classes', questions: [
          { q: 'Problem 16: Basic Class. Create a class `Student` with `name`, `course`. Add a method `introduce()`.', a: 'class Student {\n  constructor(name, course) {\n    this.name = name;\n    this.course = course;\n  }\n  introduce() {\n    console.log(`I am ${this.name} studying ${this.course}`);\n  }\n}\nnew Student("Anubhav", "MERN").introduce();' },
          { q: 'Problem 17: Employee Management. Create a class `Employee` with `name`, `salary`. Add methods `increaseSalary()`, `showSalary()`.', a: 'class Employee {\n  constructor(name, salary) {\n    this.name = name;\n    this.salary = salary;\n  }\n  increaseSalary(amt) { this.salary += amt; }\n  showSalary() { console.log(this.salary); }\n}' },
          { q: 'Problem 18: Bank Account System. Create a class `BankAccount`. Features: Deposit, Withdraw, Check Balance. Bonus: Prevent overdraft.', a: 'class BankAccount {\n  constructor(bal = 0) { this.bal = bal; }\n  deposit(amt) { this.bal += amt; }\n  withdraw(amt) {\n    if (amt > this.bal) console.log("Insufficient");\n    else this.bal -= amt;\n  }\n  check() { return this.bal; }\n}' },
          { q: 'Problem 19: Inheritance Challenge. Create `Animal` class. Create `Dog` class using `extends`. Methods: `eat()`, `bark()`.', a: 'class Animal { eat() { console.log("Nom"); } }\nclass Dog extends Animal { bark() { console.log("Woof"); } }\nnew Dog().eat();' },
          { q: 'Problem 20: Multi-Level Inheritance. Create `Person -> Employee -> Manager`. Add unique properties and methods at each level.', a: 'class Person { constructor(n) { this.name = n; } }\nclass Employee extends Person { constructor(n, r) { super(n); this.role = r; } }\nclass Manager extends Employee { manage() { console.log("Managing"); } }' }
        ]
      },
      {
        id: 'adv-static', title: '5️⃣ Static Methods', questions: [
          { q: 'Problem 21: Math Utility Class. Create `MathHelper` with static methods `add()`, `subtract()`, `multiply()`, `divide()`.', a: 'class MathHelper {\n  static add(a, b) { return a + b; }\n  static multiply(a, b) { return a * b; }\n}\nconsole.log(MathHelper.add(5, 10));' },
          { q: 'Problem 22: User Counter. Create a class `User`. Use a static property to count how many users have been created.', a: 'class User {\n  static count = 0;\n  constructor() { User.count++; }\n}\nnew User(); new User();\nconsole.log(User.count); // 2' }
        ]
      },
      {
        id: 'adv-get-set', title: '6️⃣ Getters & Setters', questions: [
          { q: 'Problem 23: Full Name Getter. Create `Person` with `firstName`, `lastName`. Create a getter `fullName`.', a: 'class Person {\n  constructor(f, l) { this.f = f; this.l = l; }\n  get fullName() { return `${this.f} ${this.l}`; }\n}\nconsole.log(new Person("John", "Doe").fullName);' },
          { q: 'Problem 24: Email Validation Setter. Create a setter `email`. Reject invalid emails.', a: 'class User {\n  set email(val) {\n    if (!val.includes("@")) throw new Error("Invalid Email");\n    this._email = val;\n  }\n  get email() { return this._email; }\n}' }
        ]
      },
      {
        id: 'adv-private', title: '7️⃣ Private Fields', questions: [
          { q: 'Problem 25: Secure Bank Account. Create `#balance` as a private field. Allow `deposit()`, `withdraw()`, `getBalance()`. Disallow direct access.', a: 'class BankAccount {\n  #balance = 0;\n  deposit(amt) { this.#balance += amt; }\n  getBalance() { return this.#balance; }\n}\nconst b = new BankAccount(); b.deposit(100); console.log(b.getBalance());' },
          { q: 'Problem 26: Student Grades System. Create `#marks`. Store marks privately. Provide methods `setMarks()`, `getMarks()`.', a: 'class Student {\n  #marks = 0;\n  setMarks(m) { this.#marks = m; }\n  getMarks() { return this.#marks; }\n}' }
        ]
      }
    ]
  }
  ]
};
