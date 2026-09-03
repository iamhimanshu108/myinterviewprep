import { Question } from '../../types';

export const PYTHON_QUESTIONS: Question[] = [
  {
    id: 'py-1',
    stack: 'python',
    topic: 'Concurrency & Core Architecture',
    title: 'What is the Global Interpreter Lock (GIL) in CPython, and how does it impact multi-threaded CPU vs I/O tasks?',
    difficulty: 'Advanced',
    summary: 'The GIL is a mutex lock in CPython that prevents multiple native OS threads from executing Python bytecode simultaneously, ensuring thread-safe reference counting memory management.',
    explanation: [
      'Why the GIL exists: CPython relies on reference counting for garbage collection. Without the GIL, concurrent threads modifying object reference counts would trigger race conditions and memory corruption.',
      'Impact on CPU-Bound tasks: Multi-threading in Python cannot utilize multiple CPU cores for CPU-heavy computation (e.g. image processing, heavy math). In fact, thread context-switching overhead can make multi-threaded CPU tasks slower than single-threaded ones.',
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
      output: `Threads (GIL limited): 3.42s
Processes (True multi-core): 0.98s`,
      executionSteps: [
        { line: 5, explanation: 'Defines purely CPU-bound math calculation function' },
        { line: 15, explanation: 'ThreadPoolExecutor threads compete for the single GIL mutex lock' },
        { line: 21, explanation: 'ProcessPoolExecutor spawns 4 OS processes across 4 physical cores' },
        { line: 23, explanation: 'Processes complete ~3.5x faster, demonstrating true parallelism' }
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
    id: 'py-2',
    stack: 'python',
    topic: 'Memory & Language Mechanics',
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
      output: `Buggy 1: ['apple']
Buggy 2: ['apple', 'banana']
Safe 1: ['apple']
Safe 2: ['banana']`,
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
    interviewTip: 'Draw a clear distinction between `is` (identity equality / same memory address `id(a) == id(b)`) and `==` (value equality).',
    tags: ['Mutables', 'Memory', 'Scope', 'Default Arguments']
  },
  {
    id: 'py-3',
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
      output: `[process_data] executed in 50.312ms
Function Name: process_data
Docstring: Processes customer transaction data.`,
      executionSteps: [
        { line: 4, explanation: 'time_execution receives target function as parameter' },
        { line: 5, explanation: '@wraps copies original function name, docstring, and annotations' },
        { line: 7, explanation: 'Calculates runtime around original function call' },
        { line: 15, explanation: '@time_execution decorates process_data at definition time' }
      ]
    },
    keyPoints: [
      'Decorators enable clean cross-cutting concerns: authentication, logging, caching (memoization), and rate-limiting.',
      'Always use `@functools.wraps` inside custom decorators to preserve introspection metadata.',
      'Decorators with arguments require 3 levels of nested functions (decorator factory).'
    ],
    interviewTip: 'Interviewers often ask how to write a decorator that accepts parameters (e.g. `@rate_limit(max_per_sec=5)`). Explain that you need an outer function that returns the actual decorator.',
    tags: ['Decorators', 'wraps', 'Metaprogramming', 'Closures']
  }
];
