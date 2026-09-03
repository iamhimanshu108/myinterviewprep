import { Question } from '../../types';

export const JAVA_QUESTIONS: Question[] = [
  // ==========================================
  // BEGINNER
  // ==========================================
  {
    id: 'java-1',
    stack: 'java',
    topic: 'Four Pillars of OOP',
    title: 'Explain the Four Pillars of Object-Oriented Programming (OOP) with real-world Java examples.',
    difficulty: 'Beginner',
    summary: 'The four fundamental pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    explanation: [
      'Encapsulation: Bundling data (fields) and methods that operate on that data into a single unit (class), restricting direct access with private access modifiers and providing getters/setters.',
      'Abstraction: Hiding internal implementation complexities and exposing only essential interfaces using abstract classes and interfaces.',
      'Inheritance: Mechanism where a child class acquires properties and behaviors of a parent class using "extends", promoting code reuse.',
      'Polymorphism: Ability of an object to take on many forms. Divided into Compile-time (Method Overloading) and Runtime (Method Overriding via dynamic method dispatch).'
    ],
    codeExample: {
      language: 'java',
      filename: 'OopPillarsDemo.java',
      code: `// 1. Abstraction: Abstract contract
interface PaymentGateway {
    void processPayment(double amount);
}

// 2. Inheritance & Polymorphism: Child implements contract
class StripeGateway implements PaymentGateway {
    // 3. Encapsulation: Private internal state
    private String apiKey;

    public StripeGateway(String apiKey) {
        this.apiKey = apiKey;
    }

    // Runtime Polymorphism: Overriding interface method
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing $" + amount + " via Stripe.");
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentGateway gateway = new StripeGateway("sk_live_123");
        gateway.processPayment(99.95);
    }
}`,
      output: 'Processing $99.95 via Stripe.',
      executionSteps: [
        { line: 2, explanation: 'Abstraction: defines abstract contract with zero implementation details' },
        { line: 7, explanation: 'Inheritance: StripeGateway implements PaymentGateway' },
        { line: 9, explanation: 'Encapsulation: apiKey field is hidden from direct external manipulation' },
        { line: 16, explanation: 'Polymorphism: Overridden method invoked dynamically at runtime' },
        { line: 24, explanation: 'Invokes interface reference resolving to concrete StripeGateway' }
      ]
    },
    keyPoints: [
      'Encapsulation protects class invariants and prevents unwanted mutations.',
      'Abstraction decouples client code from volatile implementation details.',
      'Inheritance models "is-a" relationships; prefer composition over inheritance for loose coupling.',
      'Polymorphism enables the Open-Closed Principle (open for extension, closed for modification).'
    ],
    interviewTip: 'When asked to design a real system, highlight why "composition over inheritance" is preferred in modern Java to avoid fragile base class hierarchies.',
    tags: ['OOP', 'Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism']
  },
  {
    id: 'java-2',
    stack: 'java',
    topic: 'JVM Architecture & Memory',
    title: 'What are JDK, JRE, and JVM, and how does Java achieve "Write Once, Run Anywhere"?',
    difficulty: 'Beginner',
    summary: 'JDK is the development kit with compiler tools; JRE is the runtime environment; JVM executes bytecode into platform-specific machine code.',
    explanation: [
      'JDK (Java Development Kit): Complete software development environment containing JRE, javac (compiler), jdb (debugger), and archiving tools.',
      'JRE (Java Runtime Environment): Contains the JVM implementation and core runtime class libraries (rt.jar / Java 9+ modules) needed to execute compiled Java programs.',
      'JVM (Java Virtual Machine): Abstract computing machine that executes compiled ".class" bytecode. The JVM is platform-dependent (different native binaries for Linux, macOS, Windows), but the bytecode it executes is platform-independent.',
      'Execution Pipeline: Source (.java) -> javac Compiler -> Bytecode (.class) -> JVM ClassLoader -> Bytecode Verifier -> Just-In-Time (JIT) Compiler / Interpreter -> Machine Code.'
    ],
    codeExample: {
      language: 'java',
      filename: 'CompilationFlow.java',
      code: `// 1. You write source code in App.java:
public class App {
    public static void main(String[] args) {
        System.out.println("Hello Cross-Platform World!");
    }
}

/*
 * 2. Compilation (JDK):
 *    javac App.java  --> produces App.class (Bytecode)
 *
 * 3. Execution (JRE / JVM):
 *    java App
 *
 * Inside JVM:
 *  - ClassLoader loads App.class into Method Area
 *  - Execution Engine runs JIT compiler (HotSpot)
 *  - Hot bytecode is compiled directly to native x86/ARM instructions
 */`,
      output: 'Hello Cross-Platform World!',
      executionSteps: [
        { line: 2, explanation: 'Developer writes standard Java source code' },
        { line: 9, explanation: 'javac compiles source into target-agnostic intermediate bytecode' },
        { line: 15, explanation: 'JVM ClassLoader verifies bytecode and loads into memory' },
        { line: 17, explanation: 'JIT compiler converts hot execution paths to native machine assembly' }
      ]
    },
    keyPoints: [
      'Bytecode (.class) is platform-neutral; JVM is platform-specific.',
      'JIT (Just-In-Time) compiler compiles frequently executed bytecode ("hot spots") into native machine code.',
      'Garbage Collection (GC) in JVM automatically frees unused heap memory.'
    ],
    interviewTip: 'Mention that since Java 11, Oracle eliminated the standalone JRE installer, embedding modular runtime linking via jlink directly into the JDK.',
    tags: ['JVM', 'JDK', 'JRE', 'Bytecode', 'Architecture']
  },
  {
    id: 'java-3',
    stack: 'java',
    topic: 'Strings & Memory',
    title: 'Why is String immutable in Java, and what is the difference between "==" and ".equals()"?',
    difficulty: 'Beginner',
    summary: 'String is immutable for security, thread-safety, and String Constant Pool caching. "==" checks memory references, while ".equals()" compares string character content.',
    explanation: [
      'String Constant Pool (SCP): Special memory region inside the Heap. When creating string literals (String s = "apple"), JVM reuses existing instances from the pool to save memory.',
      'Why Immutable? 1) Security: Sensitive data like database URLs and passwords cannot be mutated in-place by malicious code. 2) Thread-safety: Multiple threads can share strings without synchronization. 3) HashCode caching: String calculates its hashCode once during creation and caches it, making it fast as HashMap keys.',
      'Comparison: "==" checks referential identity (whether both variables point to the exact same memory address). ".equals()" is an overridden method in String that checks character-by-character value equality.'
    ],
    codeExample: {
      language: 'java',
      filename: 'StringPoolDemo.java',
      code: `public class StringPoolDemo {
    public static void main(String[] args) {
        String s1 = "Java"; // Created in String Constant Pool
        String s2 = "Java"; // Reuses reference from SCP
        String s3 = new String("Java"); // Explicit new heap object

        System.out.println(s1 == s2);      // true (same SCP memory address)
        System.out.println(s1 == s3);      // false (different heap references)
        System.out.println(s1.equals(s3)); // true (identical character sequence)

        // String modification creates a BRAND NEW object
        String s4 = s1.concat(" 21");
        System.out.println(s1); // "Java" (Original unchanged!)
        System.out.println(s4); // "Java 21" (New instance)
    }
}`,
      output: `true
false
true
Java
Java 21`,
      executionSteps: [
        { line: 3, explanation: 's1 created in the String Constant Pool (Heap)' },
        { line: 4, explanation: 's2 reuses the existing reference from the Pool' },
        { line: 5, explanation: 'new String creates a distinct object in standard Heap' },
        { line: 7, explanation: 's1 == s2 returns true because references are identical' },
        { line: 9, explanation: 's1.equals(s3) checks character content and returns true' },
        { line: 13, explanation: 'concat creates a brand-new String without mutating s1' }
      ]
    },
    keyPoints: [
      'Always compare Strings with .equals() or Objects.equals(), never ==.',
      'StringBuilder and StringBuffer provide mutable character buffers (StringBuffer is synchronized/thread-safe).',
      'String intern() manually adds or retrieves a string from the String Constant Pool.'
    ],
    interviewTip: 'Remember to mention that if String were mutable, modifying a string used as a HashMap key would alter its hashCode and make the mapped value permanently unreachable in the map.',
    tags: ['String', 'Memory', 'Immutability', 'SCP', 'equals']
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: 'java-4',
    stack: 'java',
    topic: 'Collections & HashMap',
    title: 'How does HashMap work internally in Java 8+, and how does it handle hash collisions?',
    difficulty: 'Intermediate',
    summary: 'HashMap uses an array of buckets. Java 8+ converts buckets with > 8 colliding entries into balanced Red-Black Trees (O(log n)) instead of linked lists (O(n)).',
    explanation: [
      'Internal Structure: HashMap uses an array of Node<K,V> (table) with default initial capacity 16 and load factor 0.75.',
      'Hashing: Calls key.hashCode(), applies bit-spreading (h ^ (h >>> 16)), and calculates bucket index using (n - 1) & hash.',
      'Collision Resolution: When different keys hash to the same bucket, elements are stored in a linked list. If a bucket reaches 8 elements (TREEIFY_THRESHOLD) and table capacity >= 64, the linked list transforms into a balanced Red-Black Tree (TreeNode), reducing worst-case lookup from O(n) to O(log n).',
      'Resizing: When size exceeds (capacity * loadFactor), the array doubles in size and rehashes existing nodes.'
    ],
    codeExample: {
      language: 'java',
      filename: 'HashMapInternals.java',
      code: `import java.util.HashMap;
import java.util.Map;

class Key {
    private final String id;
    public Key(String id) { this.id = id; }

    // Consistent hashCode and equals are mandatory!
    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Key)) return false;
        return this.id.equals(((Key) obj).id);
    }
}

public class Main {
    public static void main(String[] args) {
        Map<Key, String> map = new HashMap<>(16, 0.75f);
        Key k1 = new Key("user_1");
        map.put(k1, "Alice");
        System.out.println("Retrieved: " + map.get(k1));
    }
}`,
      output: 'Retrieved: Alice',
      executionSteps: [
        { line: 23, explanation: 'Instantiates HashMap with initial capacity 16 and load factor 0.75' },
        { line: 25, explanation: 'Calculates hash of k1, bit-spreads, and locates array bucket index' },
        { line: 26, explanation: 'Retrieves value in O(1) average time by matching hashCode and equals' }
      ]
    },
    keyPoints: [
      'Both equals() and hashCode() must be overridden together to maintain the contract.',
      'Java 8 treeifies buckets with >= 8 nodes into Red-Black trees if table size >= 64.',
      'HashMap is not thread-safe; use ConcurrentHashMap in multi-threaded environments.'
    ],
    interviewTip: 'If two objects are equal according to equals(), their hashCode() MUST be identical. If hashCodes are equal, objects are NOT necessarily equal (that is a collision).',
    tags: ['Collections', 'HashMap', 'Hashing', 'Data Structures']
  },
  {
    id: 'java-5',
    stack: 'java',
    topic: 'Exception Handling',
    title: 'What is the difference between Checked and Unchecked Exceptions, and how does try-with-resources work?',
    difficulty: 'Intermediate',
    summary: 'Checked exceptions inherit from Exception and must be declared or caught at compile-time. Unchecked exceptions inherit from RuntimeException. Try-with-resources guarantees closing AutoCloseable resources.',
    explanation: [
      'Checked Exceptions (e.g. IOException, SQLException): Checked by the compiler. Forces developer to handle recoverable external conditions using try-catch or "throws".',
      'Unchecked Exceptions (e.g. NullPointerException, IllegalArgumentException): Subclasses of RuntimeException. Represent programming logic bugs or preconditions that should not be caught in routine flow.',
      'Try-with-resources: Introduced in Java 7, replaces verbose "finally" blocks. Any object implementing java.lang.AutoCloseable declared inside try(...) is closed automatically in reverse declaration order, even if exceptions occur.'
    ],
    codeExample: {
      language: 'java',
      filename: 'TryWithResourcesDemo.java',
      code: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ResourceDemo {
    // Try-with-resources automatically invokes close() on br
    public static void readFile(String path) {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            // Checked exception caught cleanly
            System.err.println("File read failed: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        readFile("non-existent-config.txt");
    }
}`,
      output: 'File read failed: non-existent-config.txt (No such file or directory)',
      executionSteps: [
        { line: 7, explanation: 'Declares AutoCloseable BufferedReader within try header' },
        { line: 8, explanation: 'Executes file reading operations' },
        { line: 13, explanation: 'Catch block handles checked IOException' },
        { line: 14, explanation: 'JVM compiler injects automatic finally block calling br.close()' }
      ]
    },
    keyPoints: [
      'Error and RuntimeException are Unchecked; all other Throwables are Checked.',
      'Try-with-resources avoids memory and file descriptor leaks.',
      'Suppressed exceptions: If close() also throws an exception, it is attached as a suppressed exception to the primary exception.'
    ],
    interviewTip: 'Never catch java.lang.Throwable or java.lang.Error directly, as Errors represent JVM-level fatal failures (like OutOfMemoryError, StackOverflowError) which application code cannot recover from.',
    tags: ['Exceptions', 'Try-With-Resources', 'AutoCloseable', 'Error Handling']
  },
  {
    id: 'java-6',
    stack: 'java',
    topic: 'Streams & Functional Interfaces',
    title: 'How does the Java 8+ Stream API work, and what is the difference between Intermediate and Terminal operations?',
    difficulty: 'Intermediate',
    summary: 'Streams provide a declarative pipeline for processing sequences of elements. Intermediate operations are lazy and return a new Stream; terminal operations trigger execution.',
    explanation: [
      'Lazy Evaluation: Intermediate operations (filter, map, sorted, flatMap) do not execute immediately when declared. They build a pipeline of operations.',
      'Terminal Operations: Operations like collect(), count(), forEach(), reduce() initiate the traversal and produce a final result or side effect. Once closed, a stream cannot be reused.',
      'Short-circuiting: Operations like findFirst(), anyMatch(), limit() terminate computation as soon as the condition is satisfied without traversing the rest of the stream.'
    ],
    codeExample: {
      language: 'java',
      filename: 'StreamPipelineDemo.java',
      code: `import java.util.List;
import java.util.stream.Collectors;

record Employee(String name, String department, double salary) {}

public class StreamDemo {
    public static void main(String[] args) {
        List<Employee> employees = List.of(
            new Employee("Alice", "Engineering", 120000),
            new Employee("Bob", "HR", 65000),
            new Employee("Charlie", "Engineering", 140000)
        );

        // Declarative pipeline with lazy evaluation
        List<String> highEarners = employees.stream()
            .filter(e -> e.salary() > 100000) // Intermediate (lazy)
            .map(Employee::name)             // Intermediate (lazy)
            .sorted()                         // Intermediate (lazy)
            .collect(Collectors.toList());    // Terminal (executes pipeline)

        System.out.println("High Earners: " + highEarners);
    }
}`,
      output: 'High Earners: [Alice, Charlie]',
      executionSteps: [
        { line: 15, explanation: 'employees.stream() opens pipeline stream source' },
        { line: 16, explanation: 'filter checks predicate: eliminates Bob (salary <= 100000)' },
        { line: 17, explanation: 'map transforms Employee stream into String stream of names' },
        { line: 18, explanation: 'sorted orders names alphabetically' },
        { line: 19, explanation: 'collect terminal operation triggers lazy pipeline and aggregates to List' }
      ]
    },
    keyPoints: [
      'Streams do not store data; they operate on a source collection.',
      'Streams are functional and do not mutate the underlying collection.',
      'Parallel streams (parallelStream()) leverage ForkJoinPool for parallel execution across CPU cores.'
    ],
    interviewTip: 'Warn that parallel streams should only be used for CPU-bound computations on large datasets. Avoid parallel streams for I/O bound tasks because they use the shared common ForkJoinPool.',
    tags: ['Streams', 'Lambda', 'Functional', 'Java 8']
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: 'java-7',
    stack: 'java',
    topic: 'Concurrency & Thread Safety',
    title: 'Explain volatile, synchronized, and AtomicInteger in the Java Memory Model (JMM).',
    difficulty: 'Advanced',
    summary: 'volatile guarantees visibility across CPU caches; synchronized guarantees both mutual exclusion and visibility; AtomicInteger uses hardware CAS for non-blocking lock-free operations.',
    explanation: [
      'Java Memory Model (JMM): Each CPU core has local hardware caches (L1/L2). Without coordination, a thread reading a variable may read stale cached values rather than main memory.',
      'volatile: Guarantees visibility and prevents instruction reordering (happens-before relationship). It does NOT guarantee atomicity for compound operations like count++ (which is read-modify-write).',
      'synchronized: Provides mutual exclusion (only one thread holds the monitor lock at a time) and flushes CPU caches upon acquiring and releasing the lock.',
      'Atomic Classes: Uses CPU-level Compare-And-Swap (CAS) instructions to achieve thread-safe atomic operations without thread blocking or context-switching overhead.'
    ],
    codeExample: {
      language: 'java',
      filename: 'ConcurrencyComparison.java',
      code: `import java.util.concurrent.atomic.AtomicInteger;

public class CounterBenchmark {
    // 1. volatile: Visible across threads, but count++ is NOT atomic
    private volatile int volatileCount = 0;

    // 2. AtomicInteger: Thread-safe non-blocking CAS
    private final AtomicInteger atomicCount = new AtomicInteger(0);

    // 3. synchronized: Mutual exclusion with monitor lock
    private int syncCount = 0;
    public synchronized void incrementSync() {
        syncCount++;
    }

    public void incrementAtomic() {
        // Leverages native hardware CAS instruction (Lock-free)
        atomicCount.incrementAndGet();
    }
}`,
      output: 'AtomicInteger guarantees thread-safety at maximum hardware throughput',
      executionSteps: [
        { line: 5, explanation: 'volatile ensures CPU cache visibility and memory barriers' },
        { line: 8, explanation: 'AtomicInteger stores integer backed by Unsafe/VarHandle' },
        { line: 12, explanation: 'synchronized acquires monitor lock on the CounterBenchmark object' },
        { line: 18, explanation: 'incrementAndGet performs CPU CAS loop without thread descheduling' }
      ]
    },
    keyPoints: [
      'volatile: Visibility and ordering only, NOT compound atomicity.',
      'synchronized: Mutual exclusion and visibility, but incurs thread blocking overhead.',
      'CAS (Compare-And-Swap): Hardware instruction that swaps memory if current value matches expected value.'
    ],
    interviewTip: 'When asked why volatileCount++ fails in concurrent loops, explain that "i++" expands to three bytecode instructions: getfield, iadd, putfield. Context switches between these instructions cause lost updates.',
    tags: ['Concurrency', 'JMM', 'Volatile', 'AtomicInteger', 'CAS']
  },
  {
    id: 'java-8',
    stack: 'java',
    topic: 'JVM Garbage Collection & Memory Leaks',
    title: 'How do JVM Garbage Collectors (G1, ZGC) work, and how can memory leaks occur in Java despite GC?',
    difficulty: 'Advanced',
    summary: 'JVM GC categorizes objects by generation. G1 partitions heap into regions; ZGC provides sub-millisecond pauses. Leaks occur when unused objects remain rooted in the GC graph.',
    explanation: [
      'Generational Hypothesis: Most created objects die young. Heap is divided into Young Generation (Eden + 2 Survivor spaces) and Old/Tenured Generation.',
      'Garbage-First (G1) Collector: Divides the heap into hundreds of equal-sized regions. It prioritizes reclaiming regions containing the most garbage ("Garbage-First") to satisfy low-latency SLAs.',
      'ZGC (Z Garbage Collector): Scalable low-latency GC performing all heavy phases (marking, relocation) concurrently with application threads, keeping pause times under 1ms regardless of heap size (terabytes).',
      'Java Memory Leaks: Although Java manages memory automatically, if an unused object is reachable via strong references from a "GC Root" (static fields, unclosed ThreadLocals, un-deregistered listeners, forgotten caching maps), it cannot be garbage collected, eventually causing java.lang.OutOfMemoryError: Java heap space.'
    ],
    codeExample: {
      language: 'java',
      filename: 'MemoryLeakPattern.java',
      code: `import java.util.HashMap;
import java.util.Map;

public class MemoryLeakDemo {
    // ANTI-PATTERN: Static collection retains references indefinitely!
    private static final Map<String, byte[]> cache = new HashMap<>();

    public void processRequest(String requestId) {
        // Allocates 1MB payload per request
        byte[] payload = new byte[1024 * 1024];
        
        // LEAK: Strong reference held in static map prevents GC
        cache.put(requestId, payload);
    }

    // SOLUTION: Use WeakHashMap or bounded LRU cache (Caffeine / Guava)
}`,
      output: 'Unbounded static collection causes OutOfMemoryError over time',
      executionSteps: [
        { line: 6, explanation: 'Static field acts as an immortal GC Root reachable throughout JVM lifetime' },
        { line: 10, explanation: 'Allocates heavy 1MB byte buffer on the heap' },
        { line: 13, explanation: 'Strong reference stored in static cache keeps object rooted' },
        { line: 16, explanation: 'Garbage Collector cannot reclaim memory, leading to OOM crash' }
      ]
    },
    keyPoints: [
      'GC Roots: Static variables, active thread stack frames, JNI references.',
      'Unclosed ThreadLocal variables in thread pools are a common cause of production memory leaks.',
      'Use heap dump profilers (JProfiler, VisualVM, Eclipse MAT) to analyze dominator trees.'
    ],
    interviewTip: 'Mention ThreadLocal.remove(). Because thread pool threads (like Tomcat worker threads) are reused across requests, failing to call remove() leaks request-scoped data to future requests and prevents GC.',
    tags: ['JVM', 'Garbage Collection', 'G1GC', 'ZGC', 'Memory Leak']
  }
];
