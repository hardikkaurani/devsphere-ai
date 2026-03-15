# System Architecture

## Overview

DevSphere AI is built on a modern microservices-inspired architecture with a clear separation of concerns between frontend and backend.

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                        │
├─────────────────────────────────────────────────────────┤
│                  FRONTEND (React + Vite)                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages (Landing, Dashboard)                       │   │
│  │ Components (UI, Chat, Layout, Animations)        │   │
│  │ Services (API Client, State Management)          │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ API Routes (/api/v1/*)                           │   │
│  │  ├─ /auth (Register, Login)                      │   │
│  │  ├─ /agent (Chat, Sessions)                      │   │
│  │  └─ /health (Status)                             │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Controllers (Business Logic)                      │   │
│  │  ├─ AuthController                               │   │
│  │  └─ AgentController                              │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Services (Core Features)                          │   │
│  │  ├─ AgentEngine (AI Integration)                 │   │
│  │  └─ Other Services                               │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Middleware (Cross-cutting Concerns)              │   │
│  │  ├─ Authentication                               │   │
│  │  ├─ Error Handling                               │   │
│  │  ├─ Validation                                   │   │
│  │  └─ CORS/Security                                │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Models (Data Layer)                              │   │
│  │  ├─ User                                          │   │
│  │  ├─ Message                                       │   │
│  │  └─ AgentSession                                 │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │MongoDB │    │ Ollama │    │ Logs   │
    │(Data)  │    │ (AI)   │    │(Winston)
    └────────┘    └────────┘    └────────┘
```

## Component Layers

### 1. Frontend Layer (React)

**Responsibilities:**
- User interface and interactions
- State management
- API communication
- Animation and visual effects

**Key Technologies:**
- React 19 - UI library
- Vite - Build and dev server
- Tailwind CSS - Styling
- Framer Motion - Animations
- React Router - Navigation

**Component Structure:**
```
components/
├── ui/              # Reusable UI primitives
├── chat/            # Chat-specific features
├── layout/          # Page layouts
└── animations/      # Animated components
```

### 2. API Gateway Layer (Express)

**Responsibilities:**
- Route requests to appropriate controllers
- Apply middleware (auth, validation, error handling)
- Return standardized responses
- Security enforcement

**Key Features:**
- RESTful API with v1 versioning
- Rate limiting (100 requests/15 min)
- CORS configuration
- Security headers (Helmet)
- Request/response logging

### 3. Business Logic Layer (Services)

**Responsibilities:**
- Implement core features
- Orchestrate database operations
- External service integration
- Error handling and logging

**Key Services:**
- `aiService.js` - Ollama AI integration
- Database operations
- Message processing

### 4. Data Layer (MongoDB)

**Responsibilities:**
- Persist application data
- Enforce data integrity
- Provide query interface

**Collections:**
- Users - Authentication and profile
- Messages - Chat messages
- AgentSessions - Conversation contexts

## Data Flow

### User Message Flow

```
1. User types message in ChatWindow (Frontend)
   │
2. ChatInput component captures input
   │
3. handleSend() calls sendMessage() API
   │
4. Frontend sends POST /api/v1/agent/message
   │
5. Express receives request
   │
6. Middleware layer:
   - Authentication (verify JWT)
   - Validation (message content)
   - CORS check
   │
7. AgentController.sendMessage() processes request
   │
8. AgentService calls aiService.runAgent()
   │
9. aiService communicates with Ollama
   │
10. Ollama processes prompt and returns response
    │
11. Response saved to MongoDB Message collection
    │
12. Response returned to frontend
    │
13. MessageBubble component renders response
    │
14. Framer Motion animates message appearance
```

## Security Architecture

### Authentication
- **JWT Tokens** - Stateless authentication
- **Password Hashing** - bcryptjs with salt rounds
- **Token Expiration** - 7 days (configurable)
- **Secure Headers** - Helmet middleware

### Authorization
- **Protected Routes** - authMiddleware on private endpoints
- **User Validation** - Verify user ownership of resources

### Data Protection
- **HTTPS Ready** - Production deployment recommendation
- **Input Validation** - Joi schema validation
- **SQL Injection Prevention** - Mongoose ORM usage
- **Rate Limiting** - 100 requests per 15 minutes

## Error Handling Strategy

### Error Types
```javascript
AppError          // Base error class
├─ ValidationError    // Input validation failed (400)
├─ AuthenticationError // Invalid credentials (401)
├─ AuthorizationError  // Insufficient permissions (403)
├─ NotFoundError       // Resource doesn't exist (404)
├─ ConflictError       // Resource already exists (409)
├─ RateLimitError      // Too many requests (429)
└─ ExternalServiceError // Third-party service failed (502)
```

### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly error message",
  "statusCode": 400,
  "errors": {
    "field": "specific error detail"
  }
}
```

## Logging Architecture

### Log Levels
- **error** - Application errors, exceptions
- **warn** - Warnings, degraded functionality
- **info** - General information, state changes
- **debug** - Detailed debugging information

### Log Storage
- **Console** - Development real-time output
- **Files** - Production persistence
  - `logs/combined.log` - All messages
  - `logs/error.log` - Errors only

## Performance Optimization

### Frontend
- **Code Splitting** - Route-based lazy loading
- **Animation Optimization** - GPU-accelerated transforms
- **Canvas Rendering** - Hardware-accelerated background
- **Debouncing** - Input handling optimization

### Backend
- **Connection Pooling** - MongoDB connection reuse
- **Caching** - Response caching for repeated queries
- **Indexing** - Database query optimization
- **Async/Await** - Non-blocking operations

## Scalability Considerations

### Horizontally Scalable
- Stateless API design
- JWT authentication (not session-based)
- Database abstraction layer
- Message queue ready (future)

### Vertically Scalable
- Connection pool tuning
- Memory management
- CPU-bound operation optimization
- Database indexing strategy

## Deployment Architecture

```
Production Environment
├── Frontend
│   ├── Static hosting (Vercel, Netlify)
│   ├── CDN for assets
│   └── Build optimization
├── Backend
│   ├── Node.js server (AWS, Heroku, DigitalOcean)
│   ├── Environment variables
│   └── Reverse proxy (nginx)
├── Database
│   ├── MongoDB Atlas
│   ├── Automated backups
│   └── Connection pooling
└── AI
    └── Ollama instance
        ├── Model caching
        └── GPU optimization
```

## Technology Decisions

### Why React + Vite?
- Fast development server
- Optimized production builds
- Great developer experience
- Modern JavaScript support

### Why Express?
- Lightweight and flexible
- Large ecosystem
- Easy middleware integration
- Perfect for microservices

### Why MongoDB?
- Flexible schema
- Easy scaling
- JSON-like documents
- Good Node.js integration

### Why Tailwind CSS?
- Utility-first approach
- Rapid development
- Small production builds
- Great dark mode support

### Why Ollama?
- Local AI model execution
- Privacy-preserving
- No external API dependencies
- Full control over models

## Future Architecture Improvements

1. **Microservices** - Split into separate services
2. **WebSocket** - Real-time bidirectional communication
3. **Message Queue** - Async task processing (RabbitMQ)
4. **Caching Layer** - Redis for session/data caching
5. **GraphQL** - Alternative API layer
6. **Kubernetes** - Container orchestration
7. **Load Balancer** - Distribute traffic across instances
8. **API Gateway** - Kong or similar for advanced routing

---

For more information, see [README.md](README.md) or the [GitHub repository](https://github.com/yourusername/devsphere-ai).
