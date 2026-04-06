# 🔐 Environment Variables Configuration Guide

This guide explains how to properly configure environment variables for the DevSphere AI project.

## Overview

Environment variables are used to manage configuration & secure sensitive data like API keys, database credentials, and deployment settings. This prevents hardcoding sensitive information and allows different configurations for development, staging, and production.

## File Structure

```
.env files should NOT be committed to Git
.env.example files SHOULD be committed as templates
.env.local only in frontend (Vite-specific)
.env in root of respective folders
```

## Backend Configuration

### Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your actual values:
   ```bash
   # On Windows
   notepad .env
   
   # On macOS/Linux
   nano .env
   ```

### Required Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ✓ | - | Environment mode: `development`, `staging`, or `production` |
| `PORT` | ✓ | `5000` | Server port |
| `MONGO_URI` | ✓ | - | MongoDB connection string |
| `JWT_SECRET` | ✓ | - | Secret key for JWT token generation (must be strong) |

### Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_EXPIRE` | `7d` | JWT token expiration time |
| `LOG_LEVEL` | `info` | Logging level: `error`, `warn`, `info`, `debug` |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend URL for CORS |
| `OPENAI_API_KEY` | - | OpenAI API key (if using OpenAI) |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `gemma:2b` | Ollama model to use |

### Example `.env` for Development

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/devsphere-ai
JWT_SECRET=super-secret-key-change-in-production
JWT_EXPIRE=7d
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b
```

### Example `.env` for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@production-cluster.mongodb.net/devsphere-ai
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE=24h
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
OPENAI_API_KEY=sk-your-key-here
```

### Generating a Strong JWT Secret

For production, generate a cryptographically secure JWT secret:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**OpenSSL:**
```bash
openssl rand -hex 32
```

## Frontend Configuration

### Setup

1. Navigate to the frontend directory:
   ```bash
   cd devsphere-frontend
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` with your actual values:
   ```bash
   # On Windows
   notepad .env.local
   
   # On macOS/Linux
   nano .env.local
   ```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | Backend API base URL |
| `VITE_APP_ENV` | `development` | Application environment |

**Important:** Frontend env vars must be prefixed with `VITE_` to be accessible in Vite.

### Example `.env.local` for Development

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_ENV=development
```

### Example `.env.local` for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_APP_ENV=production
```

## Accessing Environment Variables

### Backend (Node.js)

```javascript
// Using dotenv (loaded automatically)
const config = require('./utils/environment').getConfig();

console.log(config.port);
console.log(config.mongoUri);
console.log(config.jwtSecret);
```

### Frontend (Vite)

```javascript
// Vite env vars are available via import.meta.env
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appEnv = import.meta.env.VITE_APP_ENV;

console.log(apiUrl);
console.log(appEnv);
```

## Security Best Practices

### 1. **Never Commit `.env` Files**
   - `.env` is already in `.gitignore`
   - Only `.env.example` should be committed
   - Review `.gitignore` to ensure it includes `.env*`

### 2. **Strong JWT Secret**
   - Use cryptographically secure random values
   - Minimum 32 characters in production
   - Change regularly in production

### 3. **Database Credentials**
   - Use strong passwords
   - Consider using database user roles with limited permissions
   - For MongoDB Atlas, use network access controls

### 4. **API Keys**
   - Rotate API keys periodically
   - Use separate keys for development and production
   - Monitor API key usage for unusual activity

### 5. **CORS Configuration**
   - Whitelist only trusted origins in production
   - Avoid using wildcard (`*`) in production
   - Specify exact domain: `https://yourdomain.com`

### 6. **Environment-Specific Settings**
   - Use `NODE_ENV=production` in production
   - Set `LOG_LEVEL=warn` in production
   - Disable sourcemaps in production builds

## Deployment Configuration

### Heroku/Render

Use the platform's environment variable dashboard:

```bash
# Using Render CLI
render env set MONGO_URI=mongodb+srv://...
render env set JWT_SECRET=your-secret-here
```

### Vercel

Configure in Project Settings → Environment Variables:
- Select "Preview", "Production" scopes appropriately
- Set `VITE_API_BASE_URL` to your production API

### Docker

Pass environment variables at runtime:

```bash
docker run \
  -e MONGO_URI=mongodb://... \
  -e JWT_SECRET=your-secret \
  -e PORT=5000 \
  your-app-image
```

## Troubleshooting

### Variables Not Loading

**Backend:**
1. Ensure `.env` file exists in `backend/` directory
2. Verify `dotenv` is installed: `npm list dotenv`
3. Check file permissions
4. Restart the server after changes

**Frontend:**
1. Ensure `.env.local` file exists in `devsphere-frontend/` directory
2. Variables must start with `VITE_`
3. Restart Vite dev server: `npm run dev`
4. Check browser console for `import.meta.env` values

### Missing Required Variables

The backend will throw an error at startup if required vars are missing. Check:
1. Variable names are spelled correctly
2. Values are not empty
3. No extra spaces in names

### CORS Errors

Ensure `CORS_ORIGIN` in backend matches frontend URL:
- Frontend: `http://localhost:5173` → Backend: `CORS_ORIGIN=http://localhost:5173`
- Frontend: `https://app.example.com` → Backend: `CORS_ORIGIN=https://app.example.com`

## Additional Resources

- [Node.js dotenv Documentation](https://www.npmjs.com/package/dotenv)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
