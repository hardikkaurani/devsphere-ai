# DevSphere AI

> A production-grade AI platform with specialized agents for coding, career guidance, and general assistance.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express.js-Backend-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)
[![Ollama](https://img.shields.io/badge/Ollama-AI%20Model-orange.svg)](https://ollama.ai/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/FramerMotion-Animations-purple.svg)](https://framer.com/motion/)
[![Code style](https://img.shields.io/badge/Code%20Style-Airbnb-ff69b4.svg)](https://github.com/airbnb/javascript)
[![GitHub stars](https://img.shields.io/github/stars/hardikkaurani/devsphere-ai?style=social)](https://github.com/hardikkaurani/devsphere-ai)
[![GitHub forks](https://img.shields.io/github/forks/hardikkaurani/devsphere-ai?style=social)](https://github.com/hardikkaurani/devsphere-ai)
[![GitHub issues](https://img.shields.io/github/issues/hardikkaurani/devsphere-ai)](https://github.com/hardikkaurani/devsphere-ai/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/hardikkaurani/devsphere-ai)](https://github.com/hardikkaurani/devsphere-ai)
[![GitHub repo size](https://img.shields.io/github/repo-size/hardikkaurani/devsphere-ai)](https://github.com/hardikkaurani/devsphere-ai)
[![Contributors](https://img.shields.io/github/contributors/hardikkaurani/devsphere-ai)](https://github.com/hardikkaurani/devsphere-ai/graphs/contributors)

---

## 🚀 Features

### Multi-Agent AI System
- **Coding Agent**: Expert programming assistance with best practices and optimization
- **Resume Agent**: Professional resume review and career guidance
- **General Agent**: Conversational AI for general knowledge and information

### Modern SaaS Design
- ✨ Futuristic animated background with particle effects
- 🎨 Glass-morphism UI components with Tailwind CSS
- 🎬 Smooth animations powered by Framer Motion
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Lightning-fast performance with optimized rendering

### Production-Ready Backend
- 🔐 JWT authentication with secure password hashing
- 🛡️ Rate limiting and security headers (Helmet)
- 📊 Structured logging with Winston
- ✅ Input validation with Joi
- 🔄 Comprehensive error handling
- 📚 RESTful API with v1 versioning

### AI Integration
- 🤖 Seamless Ollama integration
- 🧠 Context-aware conversations
- 🔄 Message history tracking
- 📈 Persistent session management

---

## 🏗️ Architecture

```
devsphere-ai/
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── services/            # Business logic
│   │   ├── models/              # MongoDB schemas
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── utils/               # Utilities & helpers
│   │   ├── config/              # Configuration files
│   │   └── index.js             # Entry point
│   └── package.json
│
├── devsphere-frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── chat/            # Chat-specific components
│   │   │   ├── layout/          # Layout components
│   │   │   └── animations/      # Animated components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/                         # Documentation
├── .env.example                  # Environment template
├── README.md                     # This file
└── package.json                  # Root package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router v7** - Navigation

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Ollama** - AI Model integration
- **Winston** - Logging
- **Joi** - Validation
- **Helmet** - Security

### DevOps & Tools
- **Nodemon** - Development auto-reload
- **ESLint** - Code linting
- **Git** - Version control

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher
- **MongoDB**: Local or Atlas instance ([Get Started](https://docs.mongodb.com/manual/installation/))
- **Ollama**: For AI model execution ([Download](https://ollama.ai/))

### Install Ollama Models

```bash
ollama pull gemma:2b
# or other models like: neural-chat, mistral, etc.
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/hardikkaurani/devsphere-ai.git
cd devsphere-ai
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
MONGO_URI=mongodb://localhost:27017/devsphere-ai

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Ollama AI
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b

# Logging
LOG_LEVEL=info
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Frontend dependencies
cd devsphere-frontend && npm install && cd ..

# Backend dependencies (if needed)
cd backend && npm install && cd ..
```

### 4. Start Services

#### Option A: Start Backend & Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run start:backend
# or
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd devsphere-frontend && npm run dev
```

#### Option B: Start Both (requires concurrently)

```bash
npm run dev:all
```

### 5. Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Docs Endpoint**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Agent Chat
- `POST /api/v1/agent/message` - Send message to AI agent
- `GET /api/v1/agent/sessions` - Get user's chat sessions
- `GET /api/v1/agent/sessions/:id` - Get session details

### Health Check
- `GET /health` - Server status

---

## 🎯 Usage Examples

### Send Message to AI Agent

```bash
curl -X POST http://localhost:5000/api/v1/agent/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "How do I optimize this React component?",
    "agentType": "coding"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Message processed",
  "reply": "Here's how to optimize your React component...",
  "sessionId": "session_123"
}
```

---

## 🔧 Development

### Running Tests

```bash
npm test
```

### Linting

```bash
cd devsphere-frontend && npm run lint
```

### Building for Production

```bash
npm run build
```

This creates:
- Frontend build: `devsphere-frontend/dist/`
- Backend: Ready to run with `npm start`

---

## 📚 Project Structure Explained

### Backend Structure

```
backend/src/
├── controllers/     # Handle HTTP requests & responses
├── services/        # Implement business logic
├── models/          # Define data schemas
├── middleware/      # Authentication, error handling, etc.
├── routes/          # Define API endpoints
├── utils/           # Helper functions & classes
├── config/          # Configuration utilities
└── index.js         # Application startup
```

### Frontend Structure

```
devsphere-frontend/src/
├── components/
│   ├── ui/          # Button, Card, Input, etc.
│   ├── chat/        # ChatWindow, MessageBubble, etc.
│   ├── layout/      # MainLayout, Sidebar, etc.
│   └── animations/  # AnimatedBackground, etc.
├── pages/           # LandingPage, Dashboard
├── services/        # API integration
├── hooks/           # Custom React hooks
├── utils/           # Helper functions
└── constants/       # Constants & config
```

---

## 🔐 Authentication Flow

1. User registers with email/password
2. Backend validates and stores password hash
3. JWT token issued on successful login
4. Token included in Authorization header for protected routes
5. Backend verifies token on each request

---

## 🚨 Error Handling

The API includes comprehensive error handling:

```json
{
  "success": false,
  "message": "User already exists",
  "statusCode": 409,
  "errors": {
    "email": "Email is already in use"
  }
}
```

---

## 📝 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

View logs in real-time during development via console output.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow Airbnb JavaScript style guide
- Use meaningful variable/function names
- Add comments for complex logic
- Keep functions small and focused

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- Inspired by modern AI platforms like OpenAI, Vercel, and Linear
- Built with ❤️ for developers and AI enthusiasts
- Special thanks to the open-source community

---

## 📧 Support & Contact

- 📨 Email: hardikkaurani2@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/hardikkaurani/devsphere-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/hardikkaurani/devsphere-ai/discussions)

---

## 🗺️ Roadmap

- [ ] User authentication & profiles
- [ ] Conversation history & export
- [ ] Custom agent creation
- [ ] Team collaboration features
- [ ] API rate limiting dashboard
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] WebSocket real-time support

---

Made with ❤️ by Hardik Kauranii | [Visit Website](#) | [View Demo](#)
