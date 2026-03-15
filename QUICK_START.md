# DevSphere AI - Quick Start For Developers

## 🚀 Project Overview

DevSphere AI is a production-grade AI platform with:
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **AI Engine:** Ollama integration for local LLMs
- **Architecture:** Modern monorepo with clear separation of concerns

---

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Ollama (for AI features)

### Installation

1. **Clone & Install**
   ```bash
   cd devsphere-ai
   npm run setup
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration:
   # - MONGODB_URI
   # - JWT_SECRET
   # - OLLAMA_BASE_URL (default: http://localhost:11434)
   ```

3. **Start Development**
   ```bash
   npm run dev:all
   ```

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:5173

---

## 📁 Project Structure

```
devsphere-ai/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth, errors
│   │   └── utils/              # Helpers, logging
│   └── package.json
├── devsphere-frontend/         # React app
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Full pages
│   │   ├── services/           # API client
│   │   └── App.jsx
│   └── package.json
└── docs/                       # Documentation
```

---

## 🔧 Common Commands

### Development
```bash
npm run backend:dev     # Start backend (port 5000)
npm run frontend:dev    # Start frontend (port 5173)
npm run dev:all         # Start both concurrently
```

### Building
```bash
npm run build:frontend  # Build React app for production
```

### Installation
```bash
npm run setup          # Install all dependencies
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user (returns JWT token)

### Chat & Sessions
- `POST /api/v1/agent/chat` - Send message to AI
  ```json
  {
    "message": "Your message",
    "agentType": "general|coding|resume",
    "sessionId": "optional-session-id"
  }
  ```
- `GET /api/v1/agent/sessions` - Get all sessions
- `GET /api/v1/agent/messages/:sessionId` - Get session messages
- `PUT /api/v1/agent/sessions/:sessionId` - Rename session
- `DELETE /api/v1/agent/sessions/:sessionId` - Delete session

**Note:** All agent endpoints require JWT authentication (Bearer token in header)

---

## 🔐 Authentication

1. **Register:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"pass123","name":"John"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"pass123"}'
   ```

3. **Use Token:**
   ```bash
   curl http://localhost:5000/api/v1/agent/sessions \
     -H "Authorization: Bearer <JWT_TOKEN>"
   ```

---

## 🤖 AI Integration

The app integrates with Ollama for local LLM deployment.

### Setup Ollama

1. **Install Ollama:** https://ollama.ai
2. **Download a model:**
   ```bash
   ollama pull llama2
   ```
3. **Start Ollama server:**
   ```bash
   ollama serve
   ```
4. **Update .env:**
   ```
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama2
   ```

### Agent Types
- **general:** General-purpose assistant
- **coding:** Code generation & debugging
- **resume:** Resume review & optimization

---

## 🐛 Debugging

### Backend Logs
- Log files located in `backend/logs/`
- Winston logger configured for structured logging
- Check console output for real-time logs

### Frontend Debugging
- Use React DevTools browser extension
- Check browser console for API errors
- Network tab to inspect API requests

### Database
- MongoDB connection logs in backend console
- Use MongoDB Compass to inspect data
- Models: User, AgentSession, Message

---

## 📋 Environment Variables

Create `.env` file in root:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/devsphere

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# AI Engine
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## ✅ Validation

Run error scan:
```bash
npm run lint:frontend  # Lint frontend code
```

Check compilation:
- VS Code will show errors inline
- Check "Problems" tab in terminal

---

## 🚀 Deployment

### Frontend
```bash
cd devsphere-frontend
npm run build
# Outputs to dist/ - deploy to any static host
```

### Backend
```bash
# Deploy backend/src to Node.js hosting
# Set environment variables
# Start with: npm start
```

### Environment
- Set NODE_ENV=production
- Use secure JWT_SECRET
- Configure MONGODB_URI for cloud DB
- Update CORS_ORIGIN to your domain

---

## 📚 Documentation

- **README.md** - Project overview
- **ARCHITECTURE.md** - System design details
- **CONTRIBUTING.md** - Development guidelines
- **PRODUCTION_AUDIT_REPORT.md** - Quality audit

---

## 🆘 Troubleshooting

**Port 5000 already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection error:**
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Verify database credentials

**Ollama not available:**
- Ensure Ollama is installed and running
- Check OLLAMA_BASE_URL is correct
- App will warn but continue without AI features

**Frontend API calls failing:**
- Check CORS_ORIGIN in backend .env
- Verify API URLs use /api/v1 prefix
- Check JWT token in Authorization header

---

## 💡 Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload
2. **Database:** Messages and sessions persist in MongoDB
3. **Testing:** Use Postman/Insomnia for API testing
4. **Logs:** Check terminal output and browser console
5. **Git:** Follow conventional commits

---

## 📞 Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review error logs
3. Check the Production Audit Report
4. Verify environment configuration

---

**Happy coding! 🎉**
