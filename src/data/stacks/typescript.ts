import { Question } from '../../types';

export const TYPESCRIPT_QUESTIONS: Question[] = [
  // ==========================================
  // TOPIC 1: Type System Fundamentals
  // ==========================================
  {
    id: 'ts-1',
    stack: 'typescript',
    topic: 'Type System Fundamentals',
    title: 'What is TypeScript and what are its core benefits over plain JavaScript?',
    difficulty: 'Beginner',
    summary: 'TypeScript is a statically-typed superset of JavaScript developed by Microsoft. It adds optional static types, interfaces, enums, and generics — all erased at compile time to produce clean JavaScript.',
    explanation: [
      'Static Type Checking: TypeScript checks types at compile time (during tsc or build), not runtime. This catches entire categories of bugs — property access on undefined, calling non-functions, passing wrong argument types — before the code runs.',
      'Developer Tooling: Types enable IDEs to provide accurate autocompletion, refactoring, and inline documentation across large codebases without reading source files manually.',
      'Zero Runtime Cost: TypeScript types are completely erased during compilation. The output is plain JavaScript — no type information ships to production. TypeScript is purely a development tool.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'ts-basics.ts',
      code: `// TypeScript catches type errors at compile time:

// ✅ Explicit types
function greet(name: string, age: number): string {
  return \`Hello, \${name}! You are \${age} years old.\`;
}

greet("Alice", 30);          // ✅ Compiles fine
// greet("Alice", "thirty"); // ❌ Compile Error: Argument of type 'string' is not
                              //    assignable to parameter of type 'number'

// ✅ TypeScript infers types automatically
const PI = 3.14159;         // inferred as: const PI: number
const message = "Hello!";   // inferred as: const message: string

// ✅ Object shape validation
interface User {
  id: number;
  name: string;
  email?: string;  // optional field
}

const user: User = { id: 1, name: "Dev" };
// const bad: User = { id: "abc", name: "Dev" }; // ❌ id must be number`,
      output: `Compile time: Type errors are reported before the program runs.\nRuntime: TypeScript compiles to clean JavaScript — no type info in output.`,
      executionSteps: [
        { line: 4, explanation: 'Function signature declares exact types for parameters and return value' },
        { line: 8, explanation: 'Calling with wrong type triggers compile-time error — caught before runtime' },
        { line: 12, explanation: 'TypeScript infers PI as number — no explicit annotation needed' },
        { line: 18, explanation: 'Interface defines the exact shape — extra or missing required fields are errors' }
      ]
    },
    keyPoints: [
      'TypeScript is a compile-to-JS language: tsc (TypeScript Compiler) converts .ts to .js.',
      'Type annotations are optional — TypeScript infers types from initialization values.',
      'tsconfig.json controls compiler settings: strictness, output directory, target JS version.'
    ],
    interviewTip: 'Key differentiator: TypeScript uses structural typing ("duck typing"), not nominal typing. If two types have the same shape, they are compatible — even without explicit implements or extends.',
    tags: ['TypeScript', 'Static Typing', 'Compile Time', 'JavaScript', 'Types']
  },
  {
    id: 'ts-2',
    stack: 'typescript',
    topic: 'Type System Fundamentals',
    title: 'What are the key differences between "interface" and "type" in TypeScript?',
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
      code: `// 1. Interface with Declaration Merging (Great for library augmentation)
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
    console.log(res.data.join(', '));  // data is string[] here
  } else {
    console.error(res.message);       // message is string here
  }
}`,
      output: `config.autoSave = true\nNarrowed response safely by discriminating 'status' field.`,
      executionSteps: [
        { line: 2, explanation: 'Declares initial UserConfig interface shape' },
        { line: 5, explanation: 'Declaration merging adds autoSave property without error' },
        { line: 12, explanation: 'Type alias defines union of string literal types — impossible with interface' },
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
    id: 'ts-3',
    stack: 'typescript',
    topic: 'Type System Fundamentals',
    title: 'What are TypeScript enums and literal types? When should you use each?',
    difficulty: 'Beginner',
    summary: 'Enums define named constants. Literal types constrain values to a specific set of strings/numbers. Const assertions and discriminated union types are often preferred over numeric enums in modern TypeScript.',
    explanation: [
      'String Enums: enum Direction { Up = "UP", Down = "DOWN" } — members are explicitly assigned strings. More debuggable than numeric enums since values are readable.',
      'Numeric Enums: enum Status { Active = 0, Inactive = 1 } — TypeScript auto-increments numeric values. Pitfall: reverse mapping allows Status[0] = "Active", which can cause unexpected behavior.',
      'Literal Union Types: type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" — achieves the same goal as string enums with zero runtime overhead and better tree-shaking.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'enums-literals.ts',
      code: `// String Enum — values are meaningful strings
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

function makeRequest(url: string, method: HttpMethod): void {
  console.log(\`\${method} \${url}\`);
}
makeRequest("/api/users", HttpMethod.GET);  // "GET /api/users"

// Const Enum — inlined at compile time (no runtime object)
const enum Direction {
  North = "NORTH",
  South = "SOUTH",
}

// Literal Union Type — modern alternative to enums
type Role = "admin" | "editor" | "viewer";

function checkAccess(role: Role): boolean {
  return role === "admin" || role === "editor";
}

checkAccess("admin");  // ✅
// checkAccess("superuser"); // ❌ Compile Error`,
      output: `GET /api/users\ncheckAccess("admin") => true`,
      executionSteps: [
        { line: 2, explanation: 'String enum creates a runtime JavaScript object with key-value pairs' },
        { line: 9, explanation: 'TypeScript enforces only valid HttpMethod values at call sites' },
        { line: 14, explanation: 'const enum is completely erased — inlined as string literals in output' },
        { line: 20, explanation: 'Union literal type achieves enum-like type safety with zero runtime cost' }
      ]
    },
    keyPoints: [
      'Prefer string enums over numeric enums — numeric enums\' reverse mapping causes subtle bugs.',
      'Const enums are fully erased at compile time (no runtime object), ideal for performance-critical code.',
      'Literal union types (type Role = "admin" | "editor") are the modern preferred alternative to enums in many TypeScript projects.'
    ],
    interviewTip: 'Many TypeScript experts and teams (including the TypeScript team itself) recommend avoiding enums in favor of as const objects or union literals because enums have compile quirks and are not valid JavaScript.',
    tags: ['Enums', 'Literal Types', 'TypeScript', 'const enum', 'Union Types']
  },
  // ==========================================
  // TOPIC 2: Type Safety & Narrowing
  // ==========================================
  {
    id: 'ts-4',
    stack: 'typescript',
    topic: 'Type Safety & Narrowing',
    title: 'Explain the difference between "any", "unknown", and "never" in TypeScript.',
    difficulty: 'Intermediate',
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
      output: `HELLO\ngetArea handles exhaustive union verification.`,
      executionSteps: [
        { line: 2, explanation: 'any disables type checker — invalid property access compiles without error' },
        { line: 5, explanation: 'unknown requires type guard or check before usage' },
        { line: 8, explanation: 'typeof check successfully narrows unknown to string' },
        { line: 24, explanation: 'Assigning to never triggers compile error if any union variant is unhandled' }
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
    id: 'ts-5',
    stack: 'typescript',
    topic: 'Type Safety & Narrowing',
    title: 'What are type guards and how do user-defined type guards work with "is" predicates?',
    difficulty: 'Intermediate',
    summary: 'Type guards are runtime checks that narrow a variable\'s type within a block. User-defined type guards use "value is Type" return predicates to inform TypeScript\'s control flow analysis.',
    explanation: [
      'Built-in Narrowing: typeof checks (typeof x === "string"), instanceof checks (x instanceof Error), and truthiness checks all narrow types automatically.',
      'User-Defined Type Guards: When built-in checks are not enough (e.g., checking a shape of an object), write a function returning `x is MyType`. TypeScript trusts this predicate to narrow within the if-true branch.',
      'Discriminated Unions: The most powerful pattern — add a common literal type field (kind, type, status) to all union members and switch/if on it. TypeScript narrows automatically without manual type guards.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'type-guards.ts',
      code: `// User-defined type guard with "is" predicate
interface Cat { species: 'cat'; meow(): void; }
interface Dog { species: 'dog'; bark(): void; }
type Animal = Cat | Dog;

// Type guard function — tells TS to narrow type in callers
function isCat(animal: Animal): animal is Cat {
  return animal.species === 'cat';
}

function makeSound(animal: Animal): void {
  if (isCat(animal)) {
    animal.meow();  // ✅ TypeScript knows it's Cat here
  } else {
    animal.bark();  // ✅ TypeScript knows it's Dog here
  }
}

// Built-in narrowing with instanceof
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;   // ✅ Narrowed to Error — .message is safe
  }
  return String(error);     // Fallback for non-Error thrown values
}`,
      output: `Type narrowing ensures only valid methods are called on each branch.`,
      executionSteps: [
        { line: 7, explanation: 'animal is Cat return type tells TS: when this returns true, animal is Cat' },
        { line: 12, explanation: 'Inside if block, TypeScript knows animal is Cat — meow() is safe' },
        { line: 19, explanation: 'instanceof narrows unknown error to Error object safely' }
      ]
    },
    keyPoints: [
      'in operator: if ("name" in obj) narrows to types that have the "name" property.',
      'Assertion functions: function assert(condition: boolean): asserts condition — narrows post-call.',
      'The as keyword is a type assertion, NOT a type guard — it does not change the runtime value and can lie to TypeScript.'
    ],
    interviewTip: 'The key insight: TypeScript\'s narrowing is purely based on control flow analysis. It tracks the type of a variable through if/else, switch, ternary, and loop branches automatically.',
    tags: ['Type Guards', 'Narrowing', 'instanceof', 'is predicate', 'Discriminated Union']
  },
  // ==========================================
  // TOPIC 3: Generics & Utility Types
  // ==========================================
  {
    id: 'ts-6',
    stack: 'typescript',
    topic: 'Generics & Utility Types',
    title: 'How do TypeScript Generics with Constraints work, and how are utility types like Partial, Pick, and Omit implemented?',
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

// 4. Building your own utility type:
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type ReadonlyProduct = MyReadonly<Product>;

console.log('Update payload:', updatePayload);
console.log('Card item:', card.name);`,
      output: `Update payload: { price: 29.99 }\nCard item: Ergonomic Desk`,
      executionSteps: [
        { line: 9, explanation: 'Generic constraint enforces id presence while preserving concrete type T' },
        { line: 14, explanation: 'Omit removes id, and Partial makes remaining fields optional' },
        { line: 21, explanation: 'Pick constructs clean sub-interface with only name and price' },
        { line: 25, explanation: 'Custom mapped type makes all properties readonly using keyof + in' }
      ]
    },
    keyPoints: [
      'Generics prevent type-casting and maintain full type inference throughout call sites.',
      '`keyof T` returns a union of string/number literal property names of T.',
      '`T[K]` is an indexed access type retrieving the value type of property K in T.'
    ],
    interviewTip: 'Be prepared to write `type MyPartial<T> = { [K in keyof T]?: T[K] }` or `type MyReadonly<T> = { readonly [K in keyof T]: T[K] }` on a whiteboard or live-coding challenge.',
    tags: ['Generics', 'Utility Types', 'Partial', 'Pick', 'Omit', 'keyof']
  },
  {
    id: 'ts-7',
    stack: 'typescript',
    topic: 'Generics & Utility Types',
    title: 'What are conditional types and template literal types in TypeScript?',
    difficulty: 'Advanced',
    summary: 'Conditional types (T extends U ? X : Y) enable type-level branching. Template literal types compose string literal unions to build type-safe event systems, CSS class names, and API route strings.',
    explanation: [
      'Conditional Types: T extends U ? X : Y evaluates type T at the type level — if T is assignable to U, the result is type X; otherwise Y. Combined with infer, you can extract types from within other types.',
      'Template Literal Types: Interpolate type unions into string templates. type EventName = `on${Capitalize<"click" | "focus">}` produces "onClick" | "onFocus" — all at compile time.',
      'Infer keyword: Inside the extends clause, infer R declares a type variable R for TypeScript to fill in by pattern-matching. ReturnType<T> uses `infer R` to extract the return type of a function.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'conditional-template-types.ts',
      code: `// Conditional Type
type IsArray<T> = T extends any[] ? 'yes' : 'no';
type A = IsArray<string[]>;  // 'yes'
type B = IsArray<number>;    // 'no'

// Built-in ReturnType uses conditional + infer
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Result = MyReturnType<() => Promise<string>>;  // Promise<string>

// Template Literal Types — type-safe event system
type EventNames = 'click' | 'focus' | 'blur';
type HandlerNames = \`on\${Capitalize<EventNames>}\`;
// HandlerNames = "onClick" | "onFocus" | "onBlur"

type EventHandlers = {
  [K in HandlerNames]?: (event: Event) => void;
};

const handlers: EventHandlers = {
  onClick: (e) => console.log('Clicked!', e),
  onFocus: (e) => console.log('Focused!', e),
  // onTypo: ... ❌ Compile Error — not a valid handler name
};`,
      output: `Type-level computation: IsArray<string[]> = 'yes', IsArray<number> = 'no'\nHandlerNames = "onClick" | "onFocus" | "onBlur"`,
      executionSteps: [
        { line: 2, explanation: 'Conditional type checks if T is assignable to any[] at the type level' },
        { line: 7, explanation: 'infer R captures the return type by pattern matching the function signature' },
        { line: 12, explanation: 'Template literal creates all combinations: on + Capitalize(EventNames)' },
        { line: 14, explanation: 'Mapped type creates optional event handler for every generated name' }
      ]
    },
    keyPoints: [
      'Distributive conditional types: applied over union types, they distribute over each member.',
      'infer is only valid within the extends clause of a conditional type.',
      'Template literal types enable building type-safe APIs with zero runtime overhead.'
    ],
    interviewTip: 'Show ReturnType<T>, Parameters<T>, and Awaited<T> as practical examples of conditional types from the TypeScript standard library. These are very frequently seen in interview discussions.',
    tags: ['Conditional Types', 'Template Literals', 'infer', 'Advanced TypeScript', 'Type-level']
  },
  {
    id: 'ts-8',
    stack: 'typescript',
    topic: 'Generics & Utility Types',
    title: 'What is declaration merging, module augmentation, and how do you extend third-party library types?',
    difficulty: 'Advanced',
    summary: 'Module augmentation lets you add properties to existing third-party type declarations without modifying node_modules. This is the correct way to extend Express.Request, window, or any library interface.',
    explanation: [
      'Declaration Merging: TypeScript merges multiple interface declarations of the same name. This is how @types/express-serve-static-core defines Request — you can add your own properties by re-declaring the interface.',
      'Module Augmentation: Use declare module "express" { interface Request { user?: AuthUser; } } to add a user property to Express.Request globally. TypeScript merges it with the library\'s existing declaration.',
      'Global Augmentation: declare global { interface Window { analytics?: Analytics; } } adds properties to browser globals like window. Used when you load a third-party script via CDN that attaches to window.'
    ],
    codeExample: {
      language: 'typescript',
      filename: 'module-augmentation.ts',
      code: `// File: src/types/express.d.ts
// Extends Express Request with authenticated user

import { User } from '../models/User';

// Module augmentation — extends the express library's types
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;          // Added by auth middleware
    requestId?: string;   // Added by request-id middleware
  }
}

// Now in your routes — TypeScript knows about req.user!
// File: src/routes/profile.ts
import { Request, Response } from 'express';

export function getProfile(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  // req.user is typed as User — full IntelliSense!
  return res.json({ name: req.user.name, email: req.user.email });
}

// Global window augmentation for CDN-loaded analytics
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

window.gtag?.("event", "page_view");  // ✅ Type-safe!`,
      output: `req.user is fully typed as User — no any assertions needed.\nwindow.gtag is safely optional-chained.`,
      executionSteps: [
        { line: 7, explanation: 'declare module opens the existing express module declaration for augmentation' },
        { line: 9, explanation: 'Adding user? to Request merges with the library\'s existing Request interface' },
        { line: 21, explanation: 'TypeScript now knows req.user exists and is typed as User' },
        { line: 25, explanation: 'declare global extends the Window interface in the browser' }
      ]
    },
    keyPoints: [
      'Module augmentation files must be .d.ts files (or .ts with no imports/exports in the global block).',
      'Never modify node_modules directly — use module augmentation or @types/your-module packages.',
      'ambient declarations (declare module, declare global) only affect TypeScript — no runtime JavaScript is emitted.'
    ],
    interviewTip: 'This is a senior-level question. Demonstrate that you know the difference between declaration merging (same file/global interface) and module augmentation (extending an external npm module\'s types).',
    tags: ['Module Augmentation', 'Declaration Merging', 'Express Types', 'Global Types', 'Advanced']
  }
];
