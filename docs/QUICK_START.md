# Quick Start Guide

Get DevSphere AI running in 5 minutes! ⚡

## Prerequisites Check

Before starting, verify you have:

- **Node.js v18+**: `node --version`
- **npm v9+**: `npm --version`
- **MongoDB**: Running locally or MongoDB Atlas account
- **Ollama**: Installed with at least one model

### Install Ollama (if needed)

```bash
# macOS
brew install ollama

# Windows/Linux
# Download from https://ollama.ai

# Pull a model
ollama pull gemma:2b
ollama pull neural-chat  # (optional)
ollama pull mistral      # (optional)

# Start Ollama service
ollama serve  # Runs on http://localhost:11434
```

---

## 1. Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/devsphere-ai.git
cd devsphere-ai

# Install all dependencies
npm install
cd devsphere-frontend && npm install && cd ..
cd backend && npm install && cd ..
```

---

## 2. Environment Setup (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# macOS/Linux
nano .env

# Windows (use your favorite editor)
notepad .env
```

**Essential configuration:**

```env
# MongoDB (use local or atlas)
MONGO_URI=mongodb://localhost:27017/devsphere-ai

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-key-change-in-production

# Port
PORT=5000

# Frontend URL (for CORS)
CORS_ORIGIN=http://localhost:5173

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b
```

---

## 3. Start Services (2 minutes)

### Option A: Separate terminals (recommended for development)

**Terminal 1 - Backend:**
```bash
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend (new terminal):**
```bash
cd devsphere-frontend
npm run dev
# Frontend running on http://localhost:5173
```

### Option B: Single command (if concurrently is installed)

```bash
npm run dev:all
```

### Option C: Check if services are running

```bash
# Test backend
curl http://localhost:5000/health

# Test MongoDB connection
# Should see "MongoDB Connected" in server logs
```

---

## 4. Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **API Health**: http://localhost:5000/health
- **Sign up**: Create an account on landing page

---

## Common Issues & Solutions

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed

```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas:
# 1. Create account at mongodb.com/cloud
# 2. Create cluster
# 3. Get connection string
# 4. Update MONGO_URI in .env
```

### Ollama Not Running

```bash
# Make sure Ollama is running
ollama serve

# Verify connection
curl http://localhost:11434/api/tags

# Pull a model if needed
ollama pull gemma:2b
```

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For frontend
cd devsphere-frontend
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use (frontend)

```bash
# Start on different port
cd devsphere-frontend
npm run dev -- --port 5174
```

---

## Verify Everything Works

### Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Should return:
{
  "success": true,
  "message": "DevSphere AI Server is running",
  "timestamp": "2024-03-15T..."
}
```

### Check Frontend

Visit http://localhost:5173 and you should see:
- ✨ Animated background
- 🎨 Beautiful landing page
- 📱 Responsive design
- ⚡ Smooth animations

### Check Logs

**Backend logs** (in terminal):
```
✓ MongoDB connected successfully
✓ Ollama AI engine is available
🚀 DevSphere AI Server Started
```

---

## First Steps

1. **Explore the landing page**
   - See features and learn about the platform
   - Click "Start Chatting Now"

2. **Create an account**
   - Sign up with email and password
   - Or sign in with test account

3. **Select an agent**
   - Choose: General, Coding, or Resume
   - Each has specialized capabilities

4. **Start chatting**
   - Ask a question
   - See AI response in real-time
   - Try different agents to compare

---

## Development Workflow

### Make Changes

1. **Frontend changes** - Auto-reload on port 5173
2. **Backend changes** - Auto-reload via nodemon on port 5000

### Run Linting

```bash
cd devsphere-frontend
npm run lint
```

### Build for Production

```bash
npm run build
```

This creates:
- `devsphere-frontend/dist/` - Frontend build
- Backend is production-ready as-is

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-amazing-feature

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "✨ Add amazing feature"

# Push to fork
git push origin feature/my-amazing-feature

# Create Pull Request on GitHub
```

---

## Next Steps

- 📚 Read [README.md](./README.md) for full documentation
- 🏗️ Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
- 🤝 Review [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- 💻 Explore the codebase
- 🧪 Write tests
- 🚀 Submit a pull request!

---

## Need Help?

- 📖 Read the docs
- 🐛 Check GitHub Issues  
- 💬 Ask in GitHub Discussions
- 📧 Email: support@devsphere.ai

---

**Happy coding! 🎉**
