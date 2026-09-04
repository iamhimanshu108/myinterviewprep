import { Question } from '../../types';

export const DATABASE_QUESTIONS: Question[] = [
  {
    id: 'db-1',
    stack: 'database',
    topic: 'SQL vs NoSQL',
    title: 'What are the main differences between SQL (Relational) and NoSQL (Non-Relational) databases?',
    difficulty: 'Beginner',
    summary: 'SQL databases use structured tables and schemas, ideal for complex relationships. NoSQL databases use flexible documents, key-values, or graphs, ideal for rapid scaling and unstructured data.',
    explanation: [
      'SQL (e.g., PostgreSQL, MySQL): Stores data in rows and columns. Strict schema enforced. Best for complex queries, transactions, and relationships (ACID compliance). Scales vertically (buying a bigger server).',
      'NoSQL (e.g., MongoDB, DynamoDB): Stores data as JSON-like documents. Flexible schema (fields can vary between documents). Best for unstructured data, rapid prototyping, and heavy read/write loads. Scales horizontally (adding more servers).'
    ],
    keyPoints: [
      'SQL = Structured, Relational, ACID, Vertical Scaling.',
      'NoSQL = Flexible, Distributed, BASE (Basically Available, Soft state, Eventual consistency), Horizontal Scaling.'
    ],
    tags: ['Database', 'SQL', 'NoSQL', 'PostgreSQL', 'MongoDB']
  },
  {
    id: 'db-2',
    stack: 'database',
    topic: 'Database Concepts',
    title: 'Explain Primary Keys, Foreign Keys, and the different types of SQL Joins.',
    difficulty: 'Beginner',
    summary: 'Keys establish relationships between tables. Joins allow you to query data across multiple tables simultaneously.',
    explanation: [
      'Primary Key: A unique identifier for a row in a table (e.g., User ID). Cannot be null.',
      'Foreign Key: A column in one table that links to the Primary Key of another table, establishing a relationship (e.g., a `user_id` column in the `Orders` table).',
      'INNER JOIN: Returns records that have matching values in BOTH tables.',
      'LEFT JOIN: Returns ALL records from the left table, and matched records from the right table. If no match, the right side contains NULLs.',
      'RIGHT JOIN: Returns ALL records from the right table, and matched from the left.',
      'FULL OUTER JOIN: Returns all records when there is a match in either left or right table.'
    ],
    codeExample: {
      language: 'sql',
      filename: 'joins.sql',
      code: `-- INNER JOIN: Get users who have placed orders
SELECT Users.name, Orders.amount
FROM Users
INNER JOIN Orders ON Users.id = Orders.user_id;

-- LEFT JOIN: Get ALL users, and their orders if they have any
SELECT Users.name, Orders.amount
FROM Users
LEFT JOIN Orders ON Users.id = Orders.user_id;`,
      output: `Left Join might return: \nAlice | $50\nBob | NULL (Bob has no orders)`,
      executionSteps: [
        { line: 4, explanation: 'Only returns users present in both tables' },
        { line: 9, explanation: 'Returns all users; Bob shows up with NULL amount since he has no orders' }
      ]
    },
    keyPoints: [
      'Foreign constraints prevent deleting a user if they still have associated orders (Referential Integrity).'
    ],
    tags: ['SQL', 'Joins', 'Keys', 'Relational']
  },
  {
    id: 'db-3',
    stack: 'database',
    topic: 'Database Concepts',
    title: 'What are ACID properties in database transactions?',
    difficulty: 'Intermediate',
    summary: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. It guarantees that database transactions are processed reliably, even in the event of errors or power failures.',
    explanation: [
      'Atomicity (All or Nothing): If a transaction contains multiple steps (e.g., deduct money from Account A, add to Account B), either ALL steps succeed, or NONE do. No partial updates.',
      'Consistency: Data must remain in a valid state according to rules/constraints (e.g., account balance cannot go below zero) before and after the transaction.',
      'Isolation: Concurrent transactions execute as if they were running sequentially. One transaction cannot read incomplete data from another ongoing transaction.',
      'Durability: Once a transaction is committed, it is saved permanently to disk, even if the database crashes immediately after.'
    ],
    keyPoints: [
      'Relational databases (SQL) heavily emphasize ACID.',
      'Many NoSQL databases sacrifice strict ACID compliance in favor of performance and horizontal scalability (Eventual Consistency).'
    ],
    interviewTip: 'Use a banking transfer analogy when explaining Atomicity. It is the easiest way to demonstrate why partial updates are catastrophic.',
    tags: ['Database', 'ACID', 'Transactions', 'SQL']
  },
  {
    id: 'db-4',
    stack: 'database',
    topic: 'Performance & Indexing',
    title: 'How do Database Indexes work, and what is a B-Tree?',
    difficulty: 'Intermediate',
    summary: 'An index is a data structure that improves the speed of data retrieval operations at the cost of slower writes and increased storage space.',
    explanation: [
      'The Problem: Without an index, finding a user by email requires a "Full Table Scan"—checking every single row one by one. O(N) time complexity.',
      'The Solution: An Index creates a sorted data structure (usually a B-Tree) mapping the indexed column to the physical location of the row on disk. O(log N) time complexity.',
      'B-Tree (Balanced Tree): A self-balancing tree data structure that keeps data sorted and allows searches, sequential access, insertions, and deletions in logarithmic time. It is highly optimized for systems that read and write large blocks of data (like hard drives).'
    ],
    codeExample: {
      language: 'sql',
      filename: 'indexes.sql',
      code: `-- Creating an index on the email column
CREATE INDEX idx_users_email ON users(email);

-- Now this query uses the B-Tree index instead of a full table scan
SELECT * FROM users WHERE email = 'alice@example.com';`,
      output: `Query Time drops from 500ms to 2ms`,
      executionSteps: [
        { line: 2, explanation: 'Database builds a separate B-Tree structure storing emails in sorted order' },
        { line: 5, explanation: 'Database traverses the B-Tree in O(log N) time to find the disk pointer for this email' }
      ]
    },
    keyPoints: [
      'Indexes speed up SELECT, WHERE, and ORDER BY clauses.',
      'Indexes slow down INSERT, UPDATE, and DELETE clauses because the index must be updated every time the data changes.',
      'Do not index every column. Only index columns frequently used in lookups.'
    ],
    tags: ['Database', 'Indexing', 'B-Tree', 'Performance']
  },
  {
    id: 'db-5',
    stack: 'database',
    topic: 'Advanced Architecture',
    title: 'What is the N+1 Query Problem and how do you solve it?',
    difficulty: 'Advanced',
    summary: 'The N+1 problem occurs when an application executes one query to retrieve a list of entities, and then N additional queries to retrieve related data for each entity.',
    explanation: [
      'The Scenario: You want to load 100 posts, and the author for each post.',
      'The Problem: ORMs (Object-Relational Mappers) often lazy-load relationships. It fires 1 query to get the 100 posts. Then, as you loop through the posts to print the author name, the ORM fires 1 query per post to fetch the author. Total = 101 queries (N+1).',
      'The Solution (Eager Loading): Tell the ORM or Database to fetch everything in a single query using SQL JOINs or ORM-specific `include`/`populate` methods.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'n-plus-one.js',
      code: `// BAD: The N+1 Problem
const posts = await Post.findAll(); // 1 Query to get 100 posts
for (let post of posts) {
    // Fires 100 separate queries! Network latency kills performance.
    const author = await User.findById(post.authorId); 
    console.log(post.title, author.name);
}

// GOOD: Eager Loading (1 Query Total)
// Translates to: SELECT * FROM Posts LEFT JOIN Users...
const postsWithAuthors = await Post.findAll({ include: User });
for (let post of postsWithAuthors) {
    // No extra queries! Data is already in memory.
    console.log(post.title, post.User.name);
}`,
      output: `BAD: 101 DB roundtrips. GOOD: 1 DB roundtrip.`,
      executionSteps: [
        { line: 5, explanation: 'Executing DB queries inside a loop is a massive anti-pattern' },
        { line: 11, explanation: 'Eager loading instructs the ORM to use a JOIN to fetch all related data at once' }
      ]
    },
    keyPoints: [
      'Network latency is the biggest bottleneck in database access. 100 small queries take significantly longer than 1 large JOIN query.',
      'GraphQL APIs are notoriously susceptible to the N+1 problem. Tools like `DataLoader` (batching and caching) are used to solve it.'
    ],
    tags: ['Database', 'N+1', 'ORM', 'Performance', 'Advanced']
  },
  {
    id: 'db-6',
    stack: 'database',
    topic: 'Advanced Architecture',
    title: 'Explain Database Sharding and Read Replicas.',
    difficulty: 'Advanced',
    summary: 'When a single database server cannot handle the load, we must scale it. Read Replicas scale read capacity, while Sharding scales write capacity and storage.',
    explanation: [
      'Read Replicas (Master-Slave): You have one Primary database that handles all Writes. Data is asynchronously copied to multiple Replica databases. The application directs all Read queries to the replicas, offloading work from the primary.',
      'Sharding (Horizontal Partitioning): When the data is too large to fit on one disk, or writes are too heavy for one CPU, the table is split across multiple servers based on a Shard Key (e.g., users A-M on Server 1, N-Z on Server 2).',
      'The Catch: Sharding makes JOINs across servers nearly impossible and introduces massive operational complexity.'
    ],
    keyPoints: [
      'Use Caching (Redis) first.',
      'Use Read Replicas second (fixes read-heavy bottlenecks).',
      'Use Sharding as an absolute last resort (fixes write/storage bottlenecks).'
    ],
    tags: ['Database', 'Scaling', 'Sharding', 'Architecture']
  }
];
