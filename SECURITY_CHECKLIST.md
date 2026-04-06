# Security Checklist & Credentials Management

## ✅ SECURITY STATUS: CLEAN

This document outlines all security measures taken and what you need to do.

---

## 🔒 Environment Variables (LOCAL ONLY)

### Backend Setup (`backend/.env`)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your-actual-mongodb-uri
JWT_SECRET=your-secret-key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b
CORS_ORIGIN=http://localhost:5173
```

### Frontend Setup (`devsphere-frontend/.env.local`)
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Root Setup (`.env`)
```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key (if using)
```

---

## 🚀 Deployment Configuration

### Vercel Environment Variables
Set these in Vercel Dashboard (Settings → Environment Variables):
```
VITE_API_URL=https://devsphere-api.onrender.com/api/v1
```

### Render Environment Variables
Set these in Render Dashboard (Environment tab):
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=strong-random-string
CORS_ORIGIN=https://devsphere-ai.vercel.app
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b
```

---

## 🛡️ Security Best Practices

### ✅ What We've Done
1. ✅ Removed all hardcoded credentials from code
2. ✅ Added `.env` to `.gitignore`
3. ✅ Created `.env.example` templates
4. ✅ Cleaned git history
5. ✅ Verified no secrets in deployment config files
6. ✅ Using environment variables everywhere

### ✅ What YOU Must Do

#### 1. **Change MongoDB Password** (CRITICAL)
- [ ] Go to https://cloud.mongodb.com
- [ ] Click your cluster → Security → Database Access
- [ ] Edit `CodingMaster` user
- [ ] Click "Change Password"
- [ ] Enter NEW strong password
- [ ] Save the new password safely

#### 2. **Update Render with New MongoDB URI**
- [ ] Go to https://render.com/dashboard
- [ ] Click `devsphere-api` service
- [ ] Go to Environment tab
- [ ] Update `MONGODB_URI` with new credentials
- [ ] Click Save
- [ ] Service auto-redeploys ✅

#### 3. **Update Vercel (if using MongoDB)**
- [ ] Go to https://vercel.com/dashboard
- [ ] Click `devsphere-ai` project
- [ ] Settings → Environment Variables
- [ ] Update any MongoDB-related variables
- [ ] Redeploy

#### 4. **Rotate OpenAI Key (Optional)**
- [ ] Go to OpenAI Platform https://platform.openai.com
- [ ] Create new API key
- [ ] Update in Render environment
- [ ] Update in Vercel environment
- [ ] Delete old key

---

## 🔍 Verification Checklist

Run these commands locally:

```bash
# Verify .env is ignored
git check-ignore .env
# Should return: .env

# Verify backend/.env is ignored
git check-ignore backend/.env
# Should return: backend/.env

# Verify no secrets in git
git grep -i "mongodb+srv\|sk-\|password" HEAD
# Should return: nothing (or only code references to process.env)

# List ignored files
git status --ignored
# Should include all .env files
```

---

## 📋 File Structure

```
devsphere-ai/
├── .env                          # LOCAL ONLY (in .gitignore)
├── .env.example                  # TEMPLATE ONLY (safe to commit)
├── backend/
│   ├── .env                      # LOCAL ONLY (in .gitignore)
│   ├── .env.example              # TEMPLATE ONLY (safe to commit)
│   └── src/
│       ├── config/
│       │   └── openai.js         # Uses process.env.OPENAI_API_KEY ✅
│       ├── middleware/
│       │   └── authMiddleware.js # Uses process.env.JWT_SECRET ✅
│       └── utils/
│           └── environment.js    # Validates all env vars ✅
├── devsphere-frontend/
│   ├── .env.local                # LOCAL ONLY (in .gitignore)
│   ├── .env.example              # TEMPLATE ONLY (safe to commit)
│   └── .env.production           # SET IN VERCEL (safe to commit)
├── vercel.json                   # SAFE TO COMMIT (no secrets)
├── render.yaml                   # SAFE TO COMMIT (no secrets)
└── SECURITY_CHECKLIST.md         # THIS FILE
```

---

## 🚨 Never Do This

❌ **DON'T** hardcode API keys in code  
❌ **DON'T** commit `.env` files to git  
❌ **DON'T** share credentials in Slack/Email  
❌ **DON'T** use weak passwords  
❌ **DON'T** reuse same secret across services  
❌ **DON'T** store production credentials in comments  

---

## ✅ Do This Instead

✅ **DO** use environment variables  
✅ **DO** add `.env*` to `.gitignore`  
✅ **DO** create `.env.example` templates  
✅ **DO** use strong passwords (32+ chars, mix of types)  
✅ **DO** rotate credentials regularly  
✅ **DO** use different secrets for dev/prod  
✅ **DO** review git history before pushing  

---

## 📞 Emergency: If Credentials Are Leaked

1. Immediately change the compromised credential
2. Review access logs on MongoDB Atlas / Render / Vercel
3. Set up alerts for unauthorized activity
4. Contact support to purge from git history if needed
5. Update all connected services with new credentials

---

## 🔗 Resources

- MongoDB Security: https://docs.mongodb.com/manual/security/
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- OWASP Secrets Management: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

---

**Last Updated: April 6, 2026**  
**Status: ✅ SECURE & CLEAN**
