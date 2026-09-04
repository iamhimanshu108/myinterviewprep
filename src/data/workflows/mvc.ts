import { WorkflowTopicData } from '../../types';

export const mvcWorkflow: WorkflowTopicData = {
    id: 'mvc',
    title: 'Core REST API Workflow (Layered Architecture)',
    subtitle: 'Client Request -> Router -> Controller -> Service -> Repository -> Database',
    tagline: 'A standard layered architecture keeps code organized, testable, and maintainable.',
    accentColor: '#F59E0B', // Amber
    tags: ['Router', 'Controller', 'Service', 'Repository', 'Database', 'MVC'],
    sections: [
      { id: 'mvc-01', num: 1, label: 'The Layered Journey', group: 'Phase 1: Beginner' },
      { id: 'mvc-04', num: 2, label: 'Interactive API Request', group: 'Phase 2: Intermediate' },
      { id: 'mvc-06', num: 3, label: 'Real-World Frameworks', group: 'Phase 3: Advanced' },
      { id: 'mvc-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'mvc-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],
    flowSteps: [
      {
        name: 'Client Request',
        detail: 'A front-end application (React, Mobile App) sends an HTTP request (GET, POST, PUT, DELETE) to a specific URL (endpoint).',
        lit: ['client', 'router', 'arr-client-router']
      },
      {
        name: 'Router (API Gateway)',
        detail: 'The application receives the request, parses the URL, and routes it to the specific block of code (Controller) designed to handle it.',
        lit: ['router', 'validation', 'arr-router-val']
      },
      {
        name: 'Controller (View / Entrypoint)',
        detail: 'This layer receives the routed request. Its ONLY job is to validate incoming data and pass it down to the business logic layer.',
        lit: ['validation', 'controller', 'arr-val-ctrl']
      },
      {
        name: 'Service (Business Logic)',
        detail: 'The brain of the API. It contains actual application rules (calculating discounts, verifying users).',
        lit: ['controller', 'service', 'arr-ctrl-service']
      },
      {
        name: 'Repository (Data Access)',
        detail: 'If the service needs data, it calls this layer. The repository translates your code into specific database queries.',
        lit: ['service', 'db', 'arr-service-db']
      },
      {
        name: 'Database Storage',
        detail: 'The actual storage system (PostgreSQL, MongoDB, MySQL, etc.) where persistent data is kept.',
        lit: ['db', 'service']
      },
      {
        name: 'Response Packaging',
        detail: 'The data travels back up the chain. The controller packages it into standard JSON with an HTTP status code, and sends it to the client.',
        lit: ['service', 'client', 'arr-db-client']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node)',
        language: 'typescript',
        fileLabel: 'src/app.ts',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        code: `// 1. ROUTER: Maps URL to Controller
app.use('/api/users', userRoutes);

// 2. CONTROLLER: Extracts/Validates request, calls Service
export const createUser = async (req: Request, res: Response) => {
  const cleanData = userSchema.parse(req.body); // Data Validation (Joi/Zod)
  const newUser = await UserService.register(cleanData);
  res.status(201).json(newUser); // Response Packaging
};

// 3. SERVICE: Business Logic
class UserService {
  static async register(data) {
    if (await UserRepository.exists(data.email)) throw new Error("Exists");
    return await UserRepository.create(data);
  }
}

// 4. REPOSITORY: Data Access
class UserRepository {
  static async create(data) {
    // 5. DATABASE: Mongoose / Sequelize
    return await UserModel.create(data); 
  }
}`,
        explanation: 'In Express, routing is handled by app.use(). The Controller extracts req.body, the Service processes the domain logic, and the Repository executes the DB operations via Mongoose or Sequelize.',
        architectureHighlights: [
          'Explicit separation prevents "Fat Controllers"',
          'Easily swap database ORMs (Mongoose -> Prisma) without touching Service logic',
          'Service layer is purely JavaScript (easily unit testable)'
        ]
      },
      springboot: {
        framework: 'springboot',
        frameworkName: 'Spring Boot (Java)',
        language: 'java',
        fileLabel: 'com/app/Application.java',
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
        code: `// 1. ROUTER & 2. CONTROLLER: @RestController maps and handles requests
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService; // Dependency Injection

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO data) {
        return new ResponseEntity<>(userService.register(data), HttpStatus.CREATED);
    }
}

// 3. SERVICE: Business Logic
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(UserDTO data) {
        if (userRepository.existsByEmail(data.getEmail())) throw new Error("Exists");
        return userRepository.save(new User(data));
    }
}

// 4. REPOSITORY & 5. DATABASE: Spring Data JPA
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email); // Automatically translates to SQL query
}`,
        explanation: 'Spring Boot enforces strict MVC/Layering via annotations (@RestController, @Service, @Repository). It uses Dependency Injection (IoC) to pass singletons automatically between layers.',
        architectureHighlights: [
          'Spring Data JPA automatically implements Repository interfaces',
          '@Valid handles incoming payload validation automatically',
          '@Service designates beans specifically meant for complex domain logic'
        ]
      },
      fastapi: {
        framework: 'fastapi',
        frameworkName: 'FastAPI (Python)',
        language: 'python',
        fileLabel: 'app/main.py',
        badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        code: `# 1. ROUTER & 2. CONTROLLER: Path Operation Functions
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Data Validation via Pydantic Models (UserCreate)
    return UserService.register(db, user)

# 3. SERVICE: Business Logic
class UserService:
    @staticmethod
    def register(db: Session, user: UserCreate):
        if UserRepository.get_by_email(db, user.email):
            raise HTTPException(400, "Exists")
        return UserRepository.create(db, user)

# 4. REPOSITORY & 5. DATABASE: SQLAlchemy
class UserRepository:
    @staticmethod
    def create(db: Session, user: UserCreate):
        db_user = UserModel(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user`,
        explanation: 'FastAPI uses Pydantic for validation and Swagger documentation. Controllers use Depends() for injecting the database session (SQLAlchemy). The Service abstracts the complex SQLAlchemy commits.',
        architectureHighlights: [
          'Pydantic automatically validates schemas at the controller boundary',
          'FastAPI Dependency Injection (Depends) provides clean database sessions',
          'Avoids tying HTTP objects to the core database logic'
        ]
      },
      django: {
        framework: 'django',
        frameworkName: 'Django (Python)',
        language: 'python',
        fileLabel: 'myapp/views.py',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        code: `# 1. ROUTER: urls.py
# urlpatterns = [ path('users/', UserCreateView.as_view()) ]

# 2. CONTROLLER (View): Django DRF Class-Based Views
class UserCreateView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data) # Data Validation
        if serializer.is_valid():
            # 3. SERVICE & 4. REPOSITORY
            # Django often uses "Fat Models" or Manager classes instead of pure Services
            user = User.objects.register_user(serializer.validated_data)
            return Response(UserSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)

# 3/4. SERVICE/REPOSITORY: Django Custom Managers (Fat Models approach)
class UserManager(models.Manager):
    def register_user(self, data):
        if self.filter(email=data['email']).exists():
            raise ValueError("Exists")
        # 5. DATABASE: Django ORM
        return self.create(**data)`,
        explanation: 'Django uses MTV (Model-Template-View) which maps closely to MVC. In Django REST Framework (DRF), Views act as Controllers. It often prefers "Fat Models" (using Custom Managers) instead of a strict separate Service layer.',
        architectureHighlights: [
          'Django ORM models (objects.filter/create) act as the Repository layer',
          'Serializers handle both payload validation and DTO transformation',
          'Custom Managers encapsulate business logic close to the database'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Routing Strategy',
        express: 'app.use("/api", routes)',
        springboot: '@RequestMapping on Controller class',
        fastapi: '@app.get("/items/") Decorator',
        django: 'urls.py urlpatterns array'
      },
      {
        feature: 'Controller (View)',
        express: 'Middleware Functions (req, res)',
        springboot: '@RestController / @PostMapping',
        fastapi: 'Path Operation Functions',
        django: 'views.py / DRF APIView classes'
      },
      {
        feature: 'Business Logic',
        express: 'Custom Service Modules',
        springboot: '@Service Dependency Injection',
        fastapi: 'Standalone Python classes/functions',
        django: 'Fat Models or Custom Managers'
      },
      {
        feature: 'Data Access / Validation',
        express: 'Mongoose / Zod',
        springboot: 'Spring Data JPA / DTOs + @Valid',
        fastapi: 'SQLAlchemy / Pydantic Models',
        django: 'Django ORM / DRF Serializers'
      }
    ],
    quiz: {
      question: 'Which of the following layers should NEVER contain direct HTTP request/response objects (like Express req/res or Django HttpRequest)?',
      options: [
        'The Router Layer',
        'The Controller Layer',
        'The Middleware Layer',
        'The Service (Business Logic) Layer'
      ],
      correctIndex: 3,
      explanation: 'The Service layer should be completely decoupled from the transport mechanism (HTTP). It should accept pure data objects (DTOs) so it can be easily unit-tested or invoked from a background cron job without needing to mock an HTTP Request object.'
    },
    bestPractices: [
      'Keep Controllers Thin: Controllers should only validate inputs, invoke the Service, and return HTTP responses.',
      'Decouple HTTP from Business Logic: Pass plain objects to your Service layer, not the raw Express req/res objects.',
      'Repository Pattern: Confine all SQL queries or ORM calls to the Repository to make swapping databases trivial.',
      'Use DTOs (Data Transfer Objects): Define clear contracts for the data moving between Controllers and Services.'
    ],
    commonMistakes: [
      {
        mistake: 'Putting Business Logic in Controllers',
        consequence: 'Code duplication, un-testable logic, and "Fat Controllers" that are thousands of lines long.',
        solution: 'Move all if/else domain rules and calculations into a dedicated Service module.'
      },
      {
        mistake: 'Tying Business Logic to the Database implementation',
        consequence: 'Changing from MongoDB to PostgreSQL requires rewriting the entire application.',
        solution: 'Inject Repositories into Services. The Service should not know whether it is calling SQL or NoSQL.'
      }
    ]
  };
