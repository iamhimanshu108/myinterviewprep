import { Question } from '../../types';

export const TYPESCRIPT_QUESTIONS: Question[] = [
  {
    id: 'ts-1',
    stack: 'typescript',
    topic: 'Type System Fundamentals',
    title: 'What are the key differences between "interface" and "type" in TypeScript, and when should you choose one over the other?',
    difficulty: 'Intermediate',
    summary: 'Interfaces are extendable object contracts that support declaration merging. Type aliases can define unions, primitives, tuples, and mapped types.',
    explanation: [
      'Declaration Merging: Multiple interface declarations with the same name automatically merge into one composite interface. Type aliases cannot be redeclared and will produce a compile error if duplicated.',
      'Unions and Primitives: Type aliases can model union types (`type ID = string | number`), intersection types, tuples, and primitive aliases. Interfaces can only describe object shapes and callable signatures.',
      'Extensibility: Interfaces extend other interfaces using `extends`. Types use intersection operators (`&`). TypeScript compiler caches interface resolution faster than complex mapped types.',
      'General Best Practice: Use `interface` for public APIs, libraries, and standard object models (OOP). Use `type` for complex types, unions, discriminated unions, and utility transformations.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'interface-vs-type.ts',
      code: `// 1. Interface with Declaration Merging (Great for libraries)
interface UserConfig {
  theme: 'light' | 'dark';
}
interface UserConfig {
  autoSave: boolean; // Merged seamlessly!
}

const config: UserConfig = { theme: 'dark', autoSave: true };

// 2. Type Alias: Essential for Unions, Tuples, and Computed Types
type Status = 'idle' | 'loading' | 'success' | 'error';
type Coordinate = [latitude: number, longitude: number];

// 3. Discriminated Union (Impossible with single interface)
type ApiResponse = 
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string };

function handleResponse(res: ApiResponse) {
  if (res.status === 'success') {
    console.log(res.data.join(', '));
  } else {
    console.error(res.message);
  }
}`,
      output: `config.autoSave = true
Narrowed response safely by discriminating 'status' field.`,
      executionSteps: [
        { line: 2, explanation: 'Declares initial UserConfig interface shape' },
        { line: 5, explanation: 'Declaration merging adds autoSave property without error' },
        { line: 12, explanation: 'Type alias defines union of string literal types' },
        { line: 21, explanation: 'TypeScript narrows type automatically inside branch check' }
      ]
    },
    keyPoints: [
      'Declaration merging allows third-party type definitions (e.g. Express.Request) to be extended safely.',
      'Types are required for unions, mapped types, template literals, and tuples.',
      'Both compile to zero runtime JavaScript overhead.'
    ],
    interviewTip: 'Mention that the official TypeScript documentation recommends using interfaces for object definitions until you specifically need features unique to type aliases (like unions or mapped types).',
    tags: ['Interface', 'Type Alias', 'Declaration Merging', 'Unions']
  },
  {
    id: 'ts-2',
    stack: 'typescript',
    topic: 'Type Safety & Narrowing',
    title: 'Explain the difference between "any", "unknown", and "never" in TypeScript.',
    difficulty: 'Advanced',
    summary: '"any" disables all type-checking. "unknown" is the type-safe top type requiring explicit narrowing before usage. "never" is the bottom type representing values that never occur.',
    explanation: [
      '"any" (Escape Hatch): Completely opts out of compile-time type checking. You can access arbitrary properties or call methods on `any`, risking runtime exceptions like `TypeError: undefined is not a function`.',
      '"unknown" (Top Type): Represents any possible value, but prevents you from calling methods or accessing properties until you perform type narrowing (via `typeof`, `instanceof`, or custom type guards).',
      '"never" (Bottom Type): Represents values that can never exist. Used for functions that never return (throw an error or run infinite loops), or for exhaustive switch statement checks to guarantee all union variants are handled.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'type-safety.ts',
      code: `// 1. any vs unknown
let unsafeVal: any = "Hello";
unsafeVal.nonExistentMethod(); // Compiles fine, crashes at runtime!

let safeVal: unknown = "Hello";
// safeVal.toUpperCase(); // ❌ Compile Error: Object is of type 'unknown'

if (typeof safeVal === 'string') {
  console.log(safeVal.toUpperCase()); // ✅ Safe: Narrowed to string
}

// 2. never for Exhaustive Type Checking
type Shape = 
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side * shape.side;
    default:
      // If a new shape is added to union, this triggers compile error!
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}`,
      output: `HELLO
getArea handles exhaustive union verification.`,
      executionSteps: [
        { line: 2, explanation: 'any disables type checker and permits invalid property access' },
        { line: 5, explanation: 'unknown requires type guard or check before usage' },
        { line: 9, explanation: 'typeof check successfully narrows unknown to string' },
        { line: 26, explanation: 'Assigning to never guarantees complete pattern matching' }
      ]
    },
    keyPoints: [
      'Always prefer `unknown` over `any` when handling untrusted inputs (e.g. JSON.parse, API responses).',
      '`never` is used by TypeScript when control flow analysis proves a condition cannot be reached.',
      'Exhaustive checking with `never` turns unhandled union variants into compile-time errors.'
    ],
    interviewTip: 'Show how `const _exhaustive: never = val;` is used in switch statements. Interviewers love this pattern because it prevents missing cases when extending unions in enterprise codebases.',
    tags: ['any', 'unknown', 'never', 'Type Narrowing', 'Exhaustiveness']
  },
  {
    id: 'ts-3',
    stack: 'typescript',
    topic: 'Generics & Utility Types',
    title: 'How do TypeScript Generics with Constraints work, and how are built-in utility types like Partial, Pick, and Omit implemented?',
    difficulty: 'Advanced',
    summary: 'Generics allow components and functions to work over a variety of types while preserving strong typing. Utility types use mapped types and keyof to transform shapes.',
    explanation: [
      'Generic Constraints: Using `<T extends { id: string }>` ensures `T` contains specific properties while keeping all original properties intact.',
      'Partial<T>: Uses mapped types to make every property optional: `{ [P in keyof T]?: T[P] }`.',
      'Pick<T, K>: Extracts a subset of properties: `{ [P in K]: T[P] }` where `K extends keyof T`.',
      'Omit<T, K>: Removes properties: `Pick<T, Exclude<keyof T, K>>`.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'generics-and-utilities.ts',
      code: `interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// 1. Generic Constraint: T must have an 'id' property
function findEntityById<T extends { id: string }>(items: T[], targetId: string): T | undefined {
  return items.find((item) => item.id === targetId);
}

// 2. Partial<T>: Update DTO where all fields are optional
type UpdateProductDTO = Partial<Omit<Product, 'id'>>;

const updatePayload: UpdateProductDTO = {
  price: 29.99 // Valid, name and stock omitted
};

// 3. Pick<T, K>: Summary card view
type ProductCardProps = Pick<Product, 'name' | 'price'>;
const card: ProductCardProps = { name: "Ergonomic Desk", price: 299 };

console.log('Update payload:', updatePayload);
console.log('Card item:', card.name);`,
      output: `Update payload: { price: 29.99 }
Card item: Ergonomic Desk`,
      executionSteps: [
        { line: 9, explanation: 'Generic constraint enforces id presence while preserving concrete type T' },
        { line: 15, explanation: 'Omit removes id, and Partial makes remaining fields optional' },
        { line: 22, explanation: 'Pick constructs clean sub-interface with only name and price' }
      ]
    },
    keyPoints: [
      'Generics prevent type-casting and maintain full type inference throughout call sites.',
      '`keyof T` returns a union of string/number literal property names of T.',
      '`T[K]` is an indexed access type retrieving the value type of property K in T.'
    ],
    interviewTip: 'Be prepared to write `type MyPartial<T> = { [K in keyof T]?: T[K] }` or `type MyReadonly<T> = { readonly [K in keyof T]: T[K] }` on a whiteboard or live-coding challenge.',
    tags: ['Generics', 'Utility Types', 'Partial', 'Pick', 'Omit', 'keyof']
  }
];
