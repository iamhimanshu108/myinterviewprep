import { Question } from '../../types';

export const PYTHON_QUESTIONS: Question[] = [
  // ==========================================
  // TOPIC 1: Python Basics & Data Types
  // ==========================================
  {
    id: 'py-1',
    stack: 'python',
    topic: 'Python Basics & Data Types',
    title: 'What are Python\'s built-in data types and how does dynamic typing work?',
    difficulty: 'Beginner',
    summary: 'Python is dynamically typed — variables hold references to objects, and the type is determined by the object itself, not the variable declaration. Built-in types include int, float, str, bool, list, tuple, dict, set, and None.',
    explanation: [
      'Dynamic Typing: In Python, you do not declare variable types. The interpreter infers the type at runtime from the assigned value. A variable can point to an int, then later point to a string.',
      'Everything is an Object: In Python, even primitives like 42 and True are full objects with methods. type(42) returns <class "int">. int.__add__ is a real method you can call.',
      'None is not null: None is a singleton object of NoneType — the canonical way to represent "no value". Use is None (identity check) rather than == None (equality check) as a best practice.'
    ],
    codeExample: {
      language: 'python',
      filename: 'data_types.py',
      code: `# Numeric types
x = 42          # int
y = 3.14        # float
z = 2 + 3j      # complex

# Sequences
name = "Python"           # str (immutable)
items = [1, 2, 3]        # list (mutable)
point = (10, 20)         # tuple (immutable)

# Mappings & Sets
profile = {"name": "Dev", "age": 25}  # dict
unique_ids = {1, 2, 3, 2}  # set (removes duplicates)
print(unique_ids)  # {1, 2, 3}

# Boolean & None
is_active = True   # bool (subclass of int: True == 1)
result = None      # NoneType singleton

# Dynamic typing: x can change its type
x = "now a string"
print(type(x))     # <class 'str'>`,
      output: `{1, 2, 3}\n<class 'str'>`,
      executionSteps: [
        { line: 2, explanation: 'Python infers type from value — no type declaration needed' },
        { line: 13, explanation: 'set automatically removes the duplicate 2, stores only unique values' },
        { line: 18, explanation: 'x changes from int to str — this is dynamic typing in action' }
      ]
    },
    keyPoints: [
      'Use type() to check a variable\'s type at runtime. Use isinstance(x, int) for type checking in production code.',
      'Python integers have arbitrary precision — no integer overflow like in C/Java.',
      'Strings in Python 3 are Unicode by default (UTF-8). Use b"bytes" for binary data.'
    ],
    interviewTip: 'Differentiate between dynamic typing (types checked at runtime) and duck typing (if it walks like a duck, treat it as a duck). Python uses both — and both are intentional design choices.',
    tags: ['Data Types', 'Dynamic Typing', 'int', 'str', 'list', 'dict']
  },
  {
    id: 'py-2',
    stack: 'python',
    topic: 'Python Basics & Data Types',
    title: 'Explain Mutable vs. Immutable types and the infamous "Default Mutable Argument" pitfall.',
    difficulty: 'Beginner',
    summary: 'Immutable objects (int, float, str, tuple, frozenset) cannot be modified in place. Mutable objects (list, dict, set) can be mutated, causing unexpected side-effects when used as default function arguments.',
    explanation: [
      'Evaluation timing: Function default arguments are evaluated once at module import / function definition time, NOT every time the function is called.',
      'The Shared Reference Bug: If you set `def append_item(item, target_list=[])`, the same list object in memory is reused across all subsequent invocations that omit `target_list`.',
      'The Canonical Idiom: Always use `None` as the default argument value, and initialize a new empty list inside the function body.'
    ],
    codeExample: {
      language: 'python',
      filename: 'mutable_defaults.py',
      code: `# ❌ BUGGY: list is created ONCE when the module loads
def buggy_add(item, item_list=[]):
    item_list.append(item)
    return item_list

print("Buggy 1:", buggy_add("apple"))   # ['apple']
print("Buggy 2:", buggy_add("banana"))  # ['apple', 'banana'] (Unexpected!)

# ✅ IDIOMATIC & SAFE: Evaluates a fresh list per invocation
def safe_add(item, item_list=None):
    if item_list is None:
        item_list = []
    item_list.append(item)
    return item_list

print("Safe 1:", safe_add("apple"))   # ['apple']
print("Safe 2:", safe_add("banana"))  # ['banana'] (Correct!)`,
      output: `Buggy 1: ['apple']\nBuggy 2: ['apple', 'banana']\nSafe 1: ['apple']\nSafe 2: ['banana']`,
      executionSteps: [
        { line: 2, explanation: 'item_list=[] is allocated once in memory at function definition' },
        { line: 6, explanation: 'Second call mutates the same list object created in memory previously' },
        { line: 10, explanation: 'safe_add uses item_list=None sentinel value' },
        { line: 12, explanation: 'Allocates a brand new list on every invocation where argument is None' }
      ]
    },
    keyPoints: [
      'Immutable types: int, float, complex, string, bytes, tuple, frozenset.',
      'Mutable types: list, dict, set, bytearray, custom class instances.',
      'Default arguments are evaluated once when `def` statement executes. Never use mutable objects as defaults.'
    ],
    interviewTip: 'Draw a clear distinction between `is` (identity equality / same memory address `id(a) == id(b)`) and `==` (value equality). Strings may be interned so "abc" is "abc" can be True but should not be relied upon.',
    tags: ['Mutables', 'Memory', 'Scope', 'Default Arguments']
  },
  {
    id: 'py-3',
    stack: 'python',
    topic: 'Python Basics & Data Types',
    title: 'What are list comprehensions, dict comprehensions, and generator expressions? When should you prefer each?',
    difficulty: 'Beginner',
    summary: 'Comprehensions are concise one-liners to build lists, dicts, and sets. Generator expressions produce items lazily one-at-a-time — ideal for large datasets where you do not need all values in memory at once.',
    explanation: [
      'List Comprehension [expr for x in iterable if cond]: Creates an entire list eagerly in memory. Use when you need the full collection for indexing, slicing, or len().',
      'Dict Comprehension {k: v for k, v in items}: Transforms key-value pairs efficiently. Great for inverting dictionaries, normalizing keys, or mapping one dataset to another.',
      'Generator Expression (expr for x in iterable): Returns a lazy iterator — values are computed on demand. Extremely memory-efficient for large datasets. Cannot be indexed. Use with sum(), max(), any(), all(), or next().'
    ],
    codeExample: {
      language: 'python',
      filename: 'comprehensions.py',
      code: `# List comprehension — creates list eagerly
squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(squares)  # [0, 4, 16, 36, 64]

# Dict comprehension — builds mapping
words = ["hello", "world", "python"]
word_lengths = {word: len(word) for word in words}
print(word_lengths)  # {'hello': 5, 'world': 5, 'python': 6}

# Set comprehension — unique values only
numbers = [1, 2, 2, 3, 3, 4]
unique_squares = {x ** 2 for x in numbers}
print(unique_squares)  # {1, 4, 9, 16}

# Generator expression — lazy, memory-efficient
import sys
list_comp = [x ** 2 for x in range(1_000_000)]
gen_expr  = (x ** 2 for x in range(1_000_000))
print(f"List size: {sys.getsizeof(list_comp):,} bytes")
print(f"Generator size: {sys.getsizeof(gen_expr)} bytes")

# Use generator with sum() — never builds full list
total = sum(x ** 2 for x in range(1_000_000))`,
      output: `[0, 4, 16, 36, 64]\n{'hello': 5, 'world': 5, 'python': 6}\n{1, 4, 9, 16}\nList size: 8,697,464 bytes\nGenerator size: 104 bytes`,
      executionSteps: [
        { line: 2, explanation: 'Filters even numbers then squares them — one line replaces a 4-line loop' },
        { line: 18, explanation: 'List comprehension allocates 8MB+ for 1 million items' },
        { line: 19, explanation: 'Generator expression uses only 104 bytes — computes values on demand' },
        { line: 22, explanation: 'sum() works perfectly with generators — consumes items one-by-one' }
      ]
    },
    keyPoints: [
      'Generators are single-pass — once exhausted, they cannot be iterated again.',
      'Nested comprehensions are legal but reduce readability beyond 2 levels — prefer explicit loops.',
      'Walrus operator (:=) in Python 3.8+ lets comprehensions compute and capture intermediate values.'
    ],
    interviewTip: 'Use generators whenever you process file lines, database rows, or API pages sequentially and do not need random access. sum(x*x for x in data) is more Pythonic and memory-efficient than sum([x*x for x in data]).',
    tags: ['List Comprehension', 'Generator', 'Dict Comprehension', 'Memory', 'Iteration']
  },
  // ==========================================
  // TOPIC 2: OOP in Python
  // ==========================================
  {
    id: 'py-4',
    stack: 'python',
    topic: 'OOP in Python',
    title: 'Explain Python classes, __init__, self, and the difference between instance and class attributes.',
    difficulty: 'Beginner',
    summary: '__init__ is the initializer called after an object is created. "self" refers to the specific instance. Instance attributes are per-object; class attributes are shared across all instances.',
    explanation: [
      '__init__ vs __new__: __new__ creates the instance (allocates memory). __init__ initializes it (sets attributes). You almost never override __new__ — __init__ is where setup logic goes.',
      'self is the first parameter of every instance method — it is the current object reference, passed automatically by Python when you call obj.method(). You can name it anything, but self is the universal convention.',
      'Class attributes live on the class object itself and are shared by all instances. Mutating a class attribute from an instance shadows it with an instance attribute — a subtle bug source.'
    ],
    codeExample: {
      language: 'python',
      filename: 'classes_basics.py',
      code: `class BankAccount:
    # Class attribute — shared by ALL instances
    interest_rate = 0.05

    def __init__(self, owner: str, balance: float = 0.0):
        # Instance attributes — unique per object
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount
        print(f"{self.owner}: deposited ₹{amount}, balance = ₹{self.balance}")

    def calculate_interest(self) -> float:
        # Accessing class attribute via self
        return self.balance * BankAccount.interest_rate

    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self.balance})"

acc1 = BankAccount("Alice", 1000)
acc2 = BankAccount("Bob")

acc1.deposit(500)
print(acc1.calculate_interest())  # 75.0
print(acc1)                        # BankAccount(owner='Alice', balance=1500)

# Changing class attribute — affects all instances
BankAccount.interest_rate = 0.07
print(acc2.calculate_interest())  # 0.0 (balance is 0)`,
      output: `Alice: deposited ₹500, balance = ₹1500\n75.0\nBankAccount(owner='Alice', balance=1500)`,
      executionSteps: [
        { line: 3, explanation: 'interest_rate is a class attribute shared by all BankAccount objects' },
        { line: 5, explanation: '__init__ receives the new instance as self and initializes it' },
        { line: 20, explanation: 'Each call to BankAccount() creates an independent instance' },
        { line: 27, explanation: 'Changing BankAccount.interest_rate affects ALL existing and future instances' }
      ]
    },
    keyPoints: [
      '@classmethod receives cls (the class itself) as first arg and can access class attributes.',
      '@staticmethod receives no implicit first argument — it is a plain function namespaced inside a class.',
      '__repr__ should return an unambiguous string that could recreate the object. __str__ is human-readable.'
    ],
    interviewTip: 'Explain the difference: if acc1.interest_rate = 0.1, Python creates a new instance attribute on acc1 that shadows (not changes) the class attribute. BankAccount.interest_rate remains 0.05.',
    tags: ['OOP', 'Classes', '__init__', 'self', 'Instance vs Class']
  },
  {
    id: 'py-5',
    stack: 'python',
    topic: 'OOP in Python',
    title: 'How does Python implement inheritance and what is the Method Resolution Order (MRO)?',
    difficulty: 'Intermediate',
    summary: 'Python supports multiple inheritance. The MRO (C3 linearization algorithm) defines the exact left-to-right, depth-first search order Python uses to resolve method lookups when a class has multiple parent classes.',
    explanation: [
      'Single Inheritance: class Dog(Animal) — Dog inherits all attributes and methods from Animal. super() calls the parent class implementation.',
      'Multiple Inheritance: class C(A, B) — Python uses C3 Linearization to build a predictable MRO. You can inspect it with ClassName.__mro__ or ClassName.mro().',
      'super(): Delegates the method call to the next class in the MRO chain — not necessarily the direct parent. Critical in multiple inheritance scenarios to ensure all parent __init__ methods are called correctly (cooperative multiple inheritance).'
    ],
    codeExample: {
      language: 'python',
      filename: 'inheritance_mro.py',
      code: `class Vehicle:
    def __init__(self, speed):
        self.speed = speed
        print(f"Vehicle.__init__ — speed={speed}")

    def describe(self):
        return f"Speed: {self.speed} km/h"

class Electric:
    def __init__(self, battery_kwh):
        self.battery = battery_kwh
        print(f"Electric.__init__ — battery={battery_kwh}kWh")

    def charge_info(self):
        return f"Battery: {self.battery}kWh"

class Tesla(Electric, Vehicle):
    def __init__(self, speed, battery):
        # super() follows MRO — calls Electric.__init__ first
        super().__init__(battery)  # Electric gets battery_kwh
        # Vehicle.__init__ must be called separately or via cooperative inheritance
        Vehicle.__init__(self, speed)
        print("Tesla.__init__ complete")

car = Tesla(speed=250, battery=100)
print("MRO:", [cls.__name__ for cls in Tesla.__mro__])`,
      output: `Electric.__init__ — battery=100kWh\nVehicle.__init__ — speed=250\nTesla.__init__ complete\nMRO: ['Tesla', 'Electric', 'Vehicle', 'object']`,
      executionSteps: [
        { line: 18, explanation: 'Tesla inherits from Electric first (left), then Vehicle — sets MRO order' },
        { line: 20, explanation: 'super().__init__ resolves to Electric.__init__ per MRO' },
        { line: 25, explanation: 'Tesla.__mro__ shows the exact order Python searches for attribute/method' }
      ]
    },
    keyPoints: [
      'Python\'s MRO uses C3 linearization: ClassName + merge(MROs of parents) left to right.',
      'Always use super() in cooperative multiple inheritance — avoids duplicate __init__ calls.',
      'isinstance(obj, Base) returns True for instances of Base and any subclass.'
    ],
    interviewTip: 'The Diamond Problem: If both B and C inherit from A, and D inherits from B and C, MRO ensures A.__init__ is called only once — Python\'s cooperative inheritance handles this cleanly unlike C++.',
    tags: ['Inheritance', 'MRO', 'super()', 'Multiple Inheritance', 'OOP']
  },
  {
    id: 'py-6',
    stack: 'python',
    topic: 'OOP in Python',
    title: 'What are dunder (magic) methods and how do they enable operator overloading?',
    difficulty: 'Intermediate',
    summary: 'Dunder methods (double underscore: __add__, __len__, __repr__, __eq__) are hooks Python calls implicitly for built-in operations, enabling custom classes to behave like built-in types.',
    explanation: [
      'Operator overloading: When you write a + b, Python calls a.__add__(b). By implementing __add__ on your class, you define what + means for your objects.',
      'Context managers: __enter__ and __exit__ enable use with the with statement, ensuring reliable resource cleanup (files, connections, locks).',
      'Comparison and hashing: __eq__ defines ==. If you define __eq__, Python automatically sets __hash__ to None (making the class unhashable) — you must also define __hash__ to use instances in sets/dict keys.'
    ],
    codeExample: {
      language: 'python',
      filename: 'magic_methods.py',
      code: `from dataclasses import dataclass

@dataclass
class Vector:
    x: float
    y: float

    def __add__(self, other: 'Vector') -> 'Vector':
        """Enables: v1 + v2"""
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar: float) -> 'Vector':
        """Enables: v1 * 3"""
        return Vector(self.x * scalar, self.y * scalar)

    def __abs__(self) -> float:
        """Enables: abs(v1) — returns magnitude"""
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1 + v2)      # Vector(4, 6)
print(v1 * 2)       # Vector(6, 8)
print(abs(v1))      # 5.0 (Pythagorean theorem)
print(len([v1]))    # 1 (list len, not vector)`,
      output: `Vector(4, 6)\nVector(6, 8)\n5.0`,
      executionSteps: [
        { line: 8, explanation: '__add__ is called when + operator is used between two Vectors' },
        { line: 12, explanation: '__mul__ is called for * with a scalar value' },
        { line: 16, explanation: '__abs__ is called by the built-in abs() function' }
      ]
    },
    keyPoints: [
      '__len__ enables len(obj), __getitem__ enables obj[index], __iter__ enables for x in obj.',
      '__enter__ and __exit__ implement the context manager protocol (with statement).',
      '@dataclass decorator auto-generates __init__, __repr__, __eq__ from class annotations.'
    ],
    interviewTip: 'A great follow-up: implementing __iter__ and __next__ makes your class an iterator. Combined with __getitem__ and __len__, your class becomes a sequence compatible with all Python built-in functions.',
    tags: ['Magic Methods', 'Dunder', 'Operator Overloading', 'OOP', 'Protocols']
  },
  // ==========================================
  // TOPIC 3: Functional Patterns & Metaprogramming
  // ==========================================
  {
    id: 'py-7',
    stack: 'python',
    topic: 'Functional Patterns & Metaprogramming',
    title: 'How do Python Decorators work under the hood, and why is @functools.wraps essential?',
    difficulty: 'Intermediate',
    summary: 'A decorator is a callable that takes another function as an argument, extends its behavior without modifying its source code, and returns a callable wrapper.',
    explanation: [
      'First-Class Functions: In Python, functions are first-class citizens: they can be passed as arguments, returned from functions, and assigned to variables.',
      'Syntactic Sugar: `@my_decorator def func(): ...` is identical to `func = my_decorator(func)`.',
      'Loss of Metadata: When a function is wrapped, its `__name__`, `__doc__`, and signature are overwritten by the wrapper function. `@functools.wraps(func)` copies the original metadata back to the wrapper, preventing debugging and introspection failures.'
    ],
    codeExample: {
      language: 'python',
      filename: 'timing_decorator.py',
      code: `import time
from functools import wraps

def time_execution(func):
    @wraps(func)  # Preserves func.__name__ and func.__doc__
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start_time
        print(f"[{func.__name__}] executed in {duration * 1000:.3f}ms")
        return result
    return wrapper

@time_execution
def process_data(records: list):
    """Processes customer transaction data."""
    time.sleep(0.05)
    return [r.upper() for r in records]

output = process_data(["order_101", "order_102"])
print(f"Function Name: {process_data.__name__}")
print(f"Docstring: {process_data.__doc__}")`,
      output: `[process_data] executed in 50.312ms\nFunction Name: process_data\nDocstring: Processes customer transaction data.`,
      executionSteps: [
        { line: 4, explanation: 'time_execution receives target function as parameter' },
        { line: 5, explanation: '@wraps copies original function name, docstring, and annotations' },
        { line: 7, explanation: 'Calculates runtime around original function call' },
        { line: 14, explanation: '@time_execution decorates process_data at definition time' }
      ]
    },
    keyPoints: [
      'Decorators enable clean cross-cutting concerns: authentication, logging, caching (memoization), and rate-limiting.',
      'Always use `@functools.wraps` inside custom decorators to preserve introspection metadata.',
      'Decorators with arguments require 3 levels of nested functions (decorator factory).'
    ],
    interviewTip: 'Interviewers often ask how to write a decorator that accepts parameters (e.g. `@rate_limit(max_per_sec=5)`). Explain that you need an outer function (factory) that accepts parameters and returns the actual decorator.',
    tags: ['Decorators', 'wraps', 'Metaprogramming', 'Closures']
  },
  {
    id: 'py-8',
    stack: 'python',
    topic: 'Functional Patterns & Metaprogramming',
    title: 'What are Python generators and the yield keyword? How do they differ from regular functions?',
    difficulty: 'Intermediate',
    summary: 'Generator functions use yield instead of return. They produce a lazy iterator that computes one value at a time, suspending execution between calls — enabling memory-efficient iteration over large sequences.',
    explanation: [
      'Execution Suspension: When a generator function hits yield, it pauses execution and yields the value to the caller. The next() call resumes exactly from where it stopped, with all local variables intact.',
      'Memory Efficiency: A generator does not build the entire list in memory. It computes values on demand. Iterating a 1TB log file line-by-line with a generator uses constant memory regardless of file size.',
      'Generator Pipeline: Multiple generators can be composed into a processing pipeline where each stage produces values lazily, avoiding the creation of intermediate lists.'
    ],
    codeExample: {
      language: 'python',
      filename: 'generators.py',
      code: `# Generator function — yields one Fibonacci number at a time
def fibonacci(limit: int):
    a, b = 0, 1
    while a < limit:
        yield a          # Suspends here, returns a to caller
        a, b = b, a + b  # Resumes here on next()

# Generator is lazy — no computation until iterated
fib_gen = fibonacci(100)
print(type(fib_gen))  # <class 'generator'>

# Consuming values one-by-one
print(next(fib_gen))  # 0
print(next(fib_gen))  # 1
print(next(fib_gen))  # 1

# Or iterate all at once
for num in fibonacci(50):
    print(num, end=" ")  # 0 1 1 2 3 5 8 13 21 34

# Generator pipeline for large data processing
def read_large_file(filepath):
    with open(filepath) as f:
        for line in f:
            yield line.strip()

def filter_errors(lines):
    for line in lines:
        if "ERROR" in line:
            yield line

# Pipeline: no full log loaded into memory!
# error_lines = filter_errors(read_large_file("app.log"))`,
      output: `<class 'generator'>\n0\n1\n1\n0 1 1 2 3 5 8 13 21 34`,
      executionSteps: [
        { line: 5, explanation: 'yield pauses the function and returns value a to the caller' },
        { line: 8, explanation: 'fibonacci(100) returns a generator object — no computation yet' },
        { line: 11, explanation: 'next() resumes the generator from the last yield point' },
        { line: 22, explanation: 'Generator pipeline: each stage processes one item at a time — constant memory' }
      ]
    },
    keyPoints: [
      'Generators implement the iterator protocol (__iter__ and __next__) automatically.',
      'send() can pass values back into a suspended generator — the basis of coroutines.',
      'yield from delegates to a sub-generator, flattening nested generators cleanly.'
    ],
    interviewTip: 'Ask yourself: do I need all values at once, or can I process them one at a time? If processing sequentially, a generator is almost always the right choice for memory efficiency.',
    tags: ['Generators', 'yield', 'Iterator', 'Memory', 'Lazy Evaluation']
  },
  // ==========================================
  // TOPIC 4: Memory & Language Mechanics
  // ==========================================
  {
    id: 'py-9',
    stack: 'python',
    topic: 'Memory & Language Mechanics',
    title: 'How does Python manage memory? Explain reference counting and the garbage collector.',
    difficulty: 'Intermediate',
    summary: 'CPython uses reference counting as the primary memory management strategy. When an object\'s reference count drops to zero, it is immediately deallocated. A cyclic garbage collector handles reference cycles that reference counting alone cannot resolve.',
    explanation: [
      'Reference Counting: Every Python object maintains a count of how many references point to it (sys.getrefcount()). When count reaches 0, the memory is freed immediately — no GC pause needed.',
      'Reference Cycles: If object A contains a reference to B, and B contains a reference back to A, neither will ever reach refcount 0. Python\'s cyclic GC (gc module) detects and breaks these cycles using a generational algorithm.',
      'Generational GC: Objects are categorized into 3 generations (0, 1, 2). New objects are Generation 0 — collected most frequently. Surviving objects are promoted to older generations collected less often, optimizing GC overhead.'
    ],
    codeExample: {
      language: 'python',
      filename: 'memory_management.py',
      code: `import sys
import gc

# Reference counting
x = [1, 2, 3]
print(sys.getrefcount(x))  # 2 (x + the getrefcount arg itself)

y = x          # Creates another reference
print(sys.getrefcount(x))  # 3

del y          # Removes one reference
print(sys.getrefcount(x))  # 2

# Reference cycle — reference counting alone can't handle this
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

a = Node(1)
b = Node(2)
a.next = b    # a holds reference to b
b.next = a    # b holds reference to a (CYCLE!)

del a, b      # refcount drops but never reaches 0 — cycle!

# Cyclic GC cleans up cycles
collected = gc.collect()
print(f"Cyclic GC collected {collected} objects")`,
      output: `2\n3\n2\nCyclic GC collected 4 objects`,
      executionSteps: [
        { line: 5, explanation: 'sys.getrefcount returns 2: one for x, one passed as arg to getrefcount' },
        { line: 7, explanation: 'y = x increments refcount to 3 — both x and y reference the same list' },
        { line: 21, explanation: 'Circular reference: a.next→b and b.next→a — neither reaches refcount 0' },
        { line: 25, explanation: 'gc.collect() explicitly runs the cyclic garbage collector' }
      ]
    },
    keyPoints: [
      'Use weakref.ref() to hold a reference without incrementing the reference count — prevents cycles in caches.',
      '__slots__ on a class prevents creation of per-instance __dict__, reducing memory footprint significantly.',
      'The gc module is rarely needed manually — Python\'s automatic GC handles most cases.'
    ],
    interviewTip: 'Mention that CPython memory is managed per-thread and there is no global heap — Python uses a private heap. The pymalloc allocator handles small objects (<= 512 bytes) more efficiently than the system malloc.',
    tags: ['Memory Management', 'Reference Counting', 'Garbage Collection', 'CPython', 'gc']
  },
  // ==========================================
  // TOPIC 5: Concurrency & Core Architecture
  // ==========================================
  {
    id: 'py-10',
    stack: 'python',
    topic: 'Concurrency & Core Architecture',
    title: 'What is the Global Interpreter Lock (GIL) and how does it impact multi-threaded CPU vs I/O tasks?',
    difficulty: 'Advanced',
    summary: 'The GIL is a mutex lock in CPython that prevents multiple native OS threads from executing Python bytecode simultaneously, ensuring thread-safe reference counting memory management.',
    explanation: [
      'Why the GIL exists: CPython relies on reference counting for garbage collection. Without the GIL, concurrent threads modifying object reference counts would trigger race conditions and memory corruption.',
      'Impact on CPU-Bound tasks: Multi-threading in Python cannot utilize multiple CPU cores for CPU-heavy computation (e.g. image processing, heavy math). Thread context-switching overhead can make multi-threaded CPU tasks slower than single-threaded ones.',
      'Impact on I/O-Bound tasks: During network requests, disk reads, or socket operations, Python releases the GIL. Threads waiting on network responses run cooperatively, making threading or asyncio highly effective for I/O tasks.',
      'Solutions for CPU Parallelism: Use the `multiprocessing` module (which spawns separate OS processes, each with its own interpreter and memory space) or leverage C extensions / NumPy.'
    ],
    codeExample: {
      language: 'python',
      filename: 'concurrency_comparison.py',
      code: `import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def cpu_heavy_task(n):
    count = 0
    for i in range(n):
        count += i * i
    return count

if __name__ == "__main__":
    nums = [10_000_000, 10_000_000, 10_000_000, 10_000_000]

    # Threads: Constrained by GIL to 1 core at a time
    start = time.perf_counter()
    with ThreadPoolExecutor(max_workers=4) as executor:
        list(executor.map(cpu_heavy_task, nums))
    print(f"Threads (GIL limited): {time.perf_counter() - start:.2f}s")

    # Processes: Bypasses GIL by spawning 4 distinct Python processes
    start = time.perf_counter()
    with ProcessPoolExecutor(max_workers=4) as executor:
        list(executor.map(cpu_heavy_task, nums))
    print(f"Processes (True multi-core): {time.perf_counter() - start:.2f}s")`,
      output: `Threads (GIL limited): 3.42s\nProcesses (True multi-core): 0.98s`,
      executionSteps: [
        { line: 4, explanation: 'Defines purely CPU-bound math calculation function' },
        { line: 14, explanation: 'ThreadPoolExecutor threads compete for the single GIL mutex lock' },
        { line: 20, explanation: 'ProcessPoolExecutor spawns 4 OS processes across 4 physical cores' },
        { line: 22, explanation: 'Processes complete ~3.5x faster, demonstrating true parallelism' }
      ]
    },
    keyPoints: [
      'The GIL restricts Python bytecode execution to 1 thread at a time per Python process in CPython.',
      'I/O-bound workloads (web APIs, DB queries) release the GIL and benefit greatly from `threading` and `asyncio`.',
      'CPU-bound workloads require `multiprocessing` or C extensions (e.g. NumPy, Polars, Cython).'
    ],
    interviewTip: 'Mention that Python 3.13 introduces experimental free-threaded mode (PEP 703) to disable the GIL, but production systems still overwhelmingly use multiprocessing for CPU tasks.',
    tags: ['GIL', 'Concurrency', 'Multiprocessing', 'Threading', 'CPython']
  },
  {
    id: 'py-11',
    stack: 'python',
    topic: 'Concurrency & Core Architecture',
    title: 'What is asyncio and how does async/await enable non-blocking I/O in Python?',
    difficulty: 'Advanced',
    summary: 'asyncio is Python\'s built-in event loop for writing concurrent I/O code using coroutines. async def defines a coroutine; await suspends it while waiting for I/O — letting the event loop run other coroutines instead of blocking.',
    explanation: [
      'Single-threaded concurrency: asyncio runs on one thread but achieves concurrency by switching between coroutines at await points — no thread creation overhead, no GIL contention.',
      'Coroutines: An async def function is a coroutine — calling it returns a coroutine object but does not execute. You must await it or schedule it with asyncio.create_task().',
      'Event Loop: asyncio.run() creates the event loop, which manages scheduling and execution of coroutines. When one coroutine awaits I/O, the event loop suspends it and runs another ready coroutine.'
    ],
    codeExample: {
      language: 'python',
      filename: 'asyncio_example.py',
      code: `import asyncio
import aiohttp   # pip install aiohttp (async HTTP client)
import time

async def fetch_url(session, url: str) -> str:
    """Coroutine: suspends at await — event loop can run others"""
    async with session.get(url) as response:
        return await response.text()

async def fetch_all_urls(urls: list[str]) -> list[str]:
    async with aiohttp.ClientSession() as session:
        # Create all tasks — they run CONCURRENTLY, not sequentially
        tasks = [asyncio.create_task(fetch_url(session, url)) for url in urls]
        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks)
        return results

urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3",
]

start = time.perf_counter()
results = asyncio.run(fetch_all_urls(urls))
print(f"Fetched {len(results)} URLs in {time.perf_counter()-start:.2f}s")
# Synchronously would take ~3s. Concurrently takes ~1s.`,
      output: `Fetched 3 URLs in 0.82s  # vs ~3s sequential`,
      executionSteps: [
        { line: 5, explanation: 'async def creates a coroutine — calling fetch_url() does not execute it yet' },
        { line: 7, explanation: 'await suspends this coroutine, letting event loop handle other work' },
        { line: 12, explanation: 'create_task schedules all 3 fetches concurrently on the event loop' },
        { line: 14, explanation: 'gather awaits all tasks — completes when the slowest one finishes' }
      ]
    },
    keyPoints: [
      'asyncio.gather() runs coroutines concurrently. asyncio.wait() provides more control over completion.',
      'Use async-compatible libraries: aiohttp (not requests), asyncpg (not psycopg2) for true async I/O.',
      'asyncio does NOT bypass the GIL — it is still single-threaded. It achieves concurrency via cooperative multitasking, not parallelism.'
    ],
    interviewTip: 'Analogy: A chef (single thread) who starts 10 dishes simultaneously by moving between pots while each dish cooks (I/O). They never sit idle waiting for one pot to boil — that is asyncio concurrency.',
    tags: ['asyncio', 'async/await', 'Coroutines', 'Event Loop', 'Concurrency']
  }
];
