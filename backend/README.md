# FT_TRANSCENDANCE Backend

Backend API for the ft_transcendance project using Fastify, TypeScript, and SQLite.

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.ts          # SQLite configuration
│   ├── blockchain.ts        # Avalanche/Solidity configuration
│   └── env.ts               # Environment variables
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts
│   │   └── guards/
│   │       ├── jwt.guard.ts
│   │       └── 2fa.guard.ts
│   │
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   ├── user.schema.ts
│   │   └── user.model.ts
│   │
│   ├── game/
│   │   ├── game.controller.ts
│   │   ├── game.service.ts
│   │   ├── game.routes.ts
│   │   └── game.schema.ts
│   │
│   ├── tournament/
│   │   ├── tournament.controller.ts
│   │   ├── tournament.service.ts
│   │   ├── tournament.routes.ts
│   │   └── tournament.schema.ts
│   │
│   └── blockchain/
│       ├── blockchain.controller.ts
│       ├── blockchain.service.ts
│       ├── blockchain.routes.ts
│       ├── contracts/
│       │   ├── TournamentScore.sol
│       │   └── deploy.ts
│       └── web3/
│           ├── client.ts
│           └── utils.ts
│
├── shared/
│   ├── plugins/
│   │   ├── cors.plugin.ts
│   │   ├── helmet.plugin.ts
│   │   ├── jwt.plugin.ts
│   │   └── websocket.plugin.ts
│   │
│   ├── middleware/
│   │   ├── error-handler.ts
│   │   ├── logger.ts
│   │   └── validation.ts
│   │
│   ├── utils/
│   │   ├── crypto.ts
│   │   ├── validation.ts
│   │   └── response.ts
│   │
│   └── types/
│       ├── express.d.ts
│       └── models.ts
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── sqlite.client.ts
│
├── app.ts                   # Fastify app setup
├── server.ts                # Entry point
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Step-by-Step Tutorial: Creating a New Module

This guide shows you how to create a complete module (e.g., User, Game, Tournament) following the MVC pattern.

### Step 1: Create the Module Folder Structure

Create a new folder under `modules/` with your module name:

```bash
mkdir -p backend/modules/user
```

Each module should contain:
- `*.model.ts` - Data model/interface
- `*.schema.ts` - Validation schemas (Zod/Joi)
- `*.service.ts` - Business logic
- `*.controller.ts` - Route handlers
- `*.routes.ts` - Route definitions

---

### Step 2: Define the Model (`user.model.ts`)

**Location:** `backend/modules/user/user.model.ts`

The model defines your data structure and TypeScript interfaces.

```typescript
// user.model.ts
export interface User {
  // Core Identity
  id: string;                    // UUID
  username: string;              // Unique display name
  email: string;                 // Unique email
  passwordHash: string;          // Hashed password (bcrypt/argon2)
  
  // Profile
  avatar?: string;               // URL or path to avatar
  displayName: string;           // Tournament alias
  bio?: string;
  
  // Authentication
  isVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  oauthProvider?: 'google' | 'github' | '42' | null;
  oauthId?: string;
  
  // Social
  friends: string[];             // Array of user IDs
  blockedUsers: string[];
  
  // Stats (computed from game history)
  totalGames: number;
  wins: number;
  losses: number;
  
  // Status
  status: 'online' | 'offline' | 'in-game';
  lastSeen: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Safe user (without sensitive data)
export interface SafeUser extends Omit<User, 'passwordHash' | 'twoFactorSecret'> {}

// User creation payload
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

// User update payload
export interface UpdateUserDto {
  displayName?: string;
  avatar?: string;
  bio?: string;
}
```

**Key Points:**
- Define all fields your entity needs
- Create DTOs (Data Transfer Objects) for create/update operations
- Separate sensitive data (use `SafeUser` for API responses)

---

### Step 3: Create Validation Schemas (`user.schema.ts`)

**Location:** `backend/modules/user/user.schema.ts`

Schemas validate incoming data. Using Zod (recommended) or Joi.

```typescript
// user.schema.ts
import { z } from 'zod';

// Registration schema
export const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  
  email: z.string()
    .email('Invalid email address')
    .toLowerCase(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  displayName: z.string()
    .min(2)
    .max(30)
    .optional()
});

// Update user schema
export const updateUserSchema = z.object({
  displayName: z.string().min(2).max(30).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional()
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

// ID param schema
export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID')
});

// Export types inferred from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

**Key Points:**
- Validate all user inputs
- Define clear error messages
- Use appropriate validators (email, uuid, regex, etc.)
- Export inferred types for TypeScript

---

### Step 4: Implement Business Logic (`user.service.ts`)

**Location:** `backend/modules/user/user.service.ts`

Services contain all business logic and database interactions.

```typescript
// user.service.ts
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { db } from '../../database/sqlite.client';
import type { User, SafeUser, CreateUserDto, UpdateUserDto } from './user.model';

export class UserService {
  
  // Create a new user
  async createUser(data: CreateUserDto): Promise<SafeUser> {
    // Check if user already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user object
    const user: User = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      passwordHash,
      displayName: data.displayName || data.username,
      avatar: null,
      bio: null,
      isVerified: false,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      oauthProvider: null,
      oauthId: null,
      friends: [],
      blockedUsers: [],
      totalGames: 0,
      wins: 0,
      losses: 0,
      status: 'offline',
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    await db.run(`
      INSERT INTO users (id, username, email, passwordHash, displayName, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user.id, user.username, user.email, user.passwordHash, user.displayName, 
        user.createdAt.toISOString(), user.updatedAt.toISOString()]);

    return this.toSafeUser(user);
  }

  // Find user by ID
  async findById(id: string): Promise<SafeUser | null> {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    return user ? this.toSafeUser(user) : null;
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  }

  // Update user
  async updateUser(id: string, data: UpdateUserDto): Promise<SafeUser> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.displayName) {
      updates.push('displayName = ?');
      values.push(data.displayName);
    }
    if (data.avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(data.avatar);
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      values.push(data.bio);
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
  }

  // Get all users (for admin or friend lists)
  async getAllUsers(limit = 50, offset = 0): Promise<SafeUser[]> {
    const users = await db.all(
      'SELECT * FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return users.map(user => this.toSafeUser(user));
  }

  // Verify password
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  // Remove sensitive data
  private toSafeUser(user: User): SafeUser {
    const { passwordHash, twoFactorSecret, ...safeUser } = user;
    return safeUser;
  }
}

export const userService = new UserService();
```

**Key Points:**
- One service per module
- Handle all database operations
- Implement validation and business rules
- Never return sensitive data (passwords, secrets)
- Use transactions for complex operations
- Handle errors appropriately

---

### Step 5: Create Controllers (`user.controller.ts`)

**Location:** `backend/modules/user/user.controller.ts`

Controllers handle HTTP requests and responses.

```typescript
// user.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from './user.service';
import type { CreateUserInput, UpdateUserInput } from './user.schema';

export class UserController {
  
  // POST /users - Create a new user
  async create(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.createUser(request.body);
      return reply.status(201).send({
        success: true,
        data: user
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // GET /users/:id - Get user by ID
  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.findById(request.params.id);
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        });
      }

      return reply.send({
        success: true,
        data: user
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message
      });
    }
  }

  // GET /users - Get all users
  async getAll(
    request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { limit = 50, offset = 0 } = request.query;
      const users = await userService.getAllUsers(limit, offset);

      return reply.send({
        success: true,
        data: users,
        pagination: { limit, offset, total: users.length }
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message
      });
    }
  }

  // PATCH /users/:id - Update user
  async update(
    request: FastifyRequest<{ 
      Params: { id: string };
      Body: UpdateUserInput 
    }>,
    reply: FastifyReply
  ) {
    try {
      // Ensure user can only update their own profile
      // (add authentication check here)
      
      const user = await userService.updateUser(
        request.params.id,
        request.body
      );

      return reply.send({
        success: true,
        data: user
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /users/:id - Delete user
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      await userService.deleteUser(request.params.id);

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message
      });
    }
  }
}

export const userController = new UserController();
```

**Key Points:**
- One controller per module
- Handle request/response
- Validate input (done by routes middleware)
- Call service methods
- Return consistent response format
- Handle errors with appropriate HTTP status codes

---

### Step 6: Define Routes (`user.routes.ts`)

**Location:** `backend/modules/user/user.routes.ts`

Routes connect URLs to controller methods and apply validation.

```typescript
// user.routes.ts
import type { FastifyInstance } from 'fastify';
import { userController } from './user.controller';
import { 
  createUserSchema, 
  updateUserSchema, 
  userIdSchema 
} from './user.schema';
import { validateRequest } from '../../shared/middleware/validation';

export async function userRoutes(fastify: FastifyInstance) {
  
  // POST /api/users - Create user
  fastify.post(
    '/',
    {
      preValidation: validateRequest({ body: createUserSchema })
    },
    userController.create.bind(userController)
  );

  // GET /api/users - Get all users
  fastify.get(
    '/',
    userController.getAll.bind(userController)
  );

  // GET /api/users/:id - Get user by ID
  fastify.get(
    '/:id',
    {
      preValidation: validateRequest({ params: userIdSchema })
    },
    userController.getById.bind(userController)
  );

  // PATCH /api/users/:id - Update user
  fastify.patch(
    '/:id',
    {
      preValidation: validateRequest({ 
        params: userIdSchema,
        body: updateUserSchema 
      })
    },
    userController.update.bind(userController)
  );

  // DELETE /api/users/:id - Delete user
  fastify.delete(
    '/:id',
    {
      preValidation: validateRequest({ params: userIdSchema })
    },
    userController.delete.bind(userController)
  );
}
```

**Key Points:**
- Register all module routes
- Apply validation middleware
- Use proper HTTP methods (GET, POST, PATCH, DELETE)
- Group related routes under a common prefix
- Add authentication guards where needed

---

### Step 7: Register Module in App (`app.ts`)

**Location:** `backend/app.ts`

Register your module routes in the main app.

```typescript
// app.ts
import Fastify from 'fastify';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { gameRoutes } from './modules/game/game.routes';
import { tournamentRoutes } from './modules/tournament/tournament.routes';

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  // Register plugins
  await app.register(import('./shared/plugins/cors.plugin'));
  await app.register(import('./shared/plugins/helmet.plugin'));
  await app.register(import('./shared/plugins/jwt.plugin'));

  // Register routes
  await app.register(userRoutes, { prefix: '/api/users' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(gameRoutes, { prefix: '/api/games' });
  await app.register(tournamentRoutes, { prefix: '/api/tournaments' });

  return app;
}
```

---

### Step 8: Create Database Migration

**Location:** `backend/database/migrations/001_create_users_table.sql`

Create the database schema for your module.

```sql
-- 001_create_users_table.sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  displayName TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  isVerified INTEGER DEFAULT 0,
  twoFactorEnabled INTEGER DEFAULT 0,
  twoFactorSecret TEXT,
  oauthProvider TEXT,
  oauthId TEXT,
  status TEXT DEFAULT 'offline',
  totalGames INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  lastSeen TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

---

## 📋 Checklist for Creating a New Module

- [ ] Create module folder: `modules/your-module/`
- [ ] Define data model: `your-module.model.ts`
- [ ] Create validation schemas: `your-module.schema.ts`
- [ ] Implement service logic: `your-module.service.ts`
- [ ] Create controller: `your-module.controller.ts`
- [ ] Define routes: `your-module.routes.ts`
- [ ] Register routes in `app.ts`
- [ ] Create database migration
- [ ] Add tests (optional but recommended)
- [ ] Update this README if needed

---

## 🗂️ Module Examples

### User Module (shown above)
- User registration and authentication
- Profile management
- Friend system

### Game Module
```
game/
├── game.model.ts      # Game, GameHistory interfaces
├── game.schema.ts     # Validation for game creation
├── game.service.ts    # Game logic, score tracking
├── game.controller.ts # API endpoints
└── game.routes.ts     # Route definitions
```

### Tournament Module
```
tournament/
├── tournament.model.ts      # Tournament, Match, Round interfaces
├── tournament.schema.ts     # Validation schemas
├── tournament.service.ts    # Bracket generation, matchmaking
├── tournament.controller.ts # Tournament management endpoints
└── tournament.routes.ts     # Route definitions
```

### Blockchain Module
```
blockchain/
├── blockchain.controller.ts
├── blockchain.service.ts
├── blockchain.routes.ts
├── contracts/
│   ├── TournamentScore.sol  # Solidity smart contract
│   └── deploy.ts            # Deployment script
└── web3/
    ├── client.ts            # Web3 connection
    └── utils.ts             # Blockchain utilities
```

---

## 🔒 Security Best Practices

1. **Password Hashing**: Always use bcrypt or argon2
2. **Input Validation**: Validate ALL user inputs with schemas
3. **SQL Injection**: Use parameterized queries
4. **XSS Protection**: Sanitize outputs, use helmet.js
5. **HTTPS**: Enable HTTPS in production
6. **JWT**: Secure token-based authentication
7. **Rate Limiting**: Prevent abuse
8. **CORS**: Configure allowed origins
9. **Environment Variables**: Store secrets in `.env`
10. **Error Handling**: Never expose internal errors to users

---

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Start production
npm start

# Run migrations
npm run migrate

# Run tests
npm test

# Lint
npm run lint
```

---

## 📚 Additional Resources

- [Fastify Documentation](https://www.fastify.io/)
- [Zod Validation](https://github.com/colinhacks/zod)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ❓ FAQ

**Q: Why separate model, schema, service, controller, and routes?**
A: Separation of concerns - each file has one responsibility, making code easier to maintain and test.

**Q: Can I use a different validation library?**
A: Yes, you can use Joi, Yup, or other libraries, but be consistent across the project.

**Q: Should I use classes or functions?**
A: Either works. Classes are used here for consistency and state management.

**Q: How do I add authentication to routes?**
A: Use the JWT guard middleware in your route options (see auth module).

---

Built with ❤️ for ft_transcendence