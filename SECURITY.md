# Security Guidelines for ToolkitAI

## ✅ What's Safe in Public Repository

- Source code (frontend & backend)
- Dockerfile and docker-compose.yml
- nginx configuration (without SSL certs)
- Documentation

## ⚠️ NEVER Commit These

### 🔐 Secrets & Credentials
- `.env` files (use `.env.example` instead)
- API keys (OpenAI, Replicate, etc.)
- Database passwords
- JWT secrets
- Supabase keys

### 🔑 SSH & SSL
- SSH private keys (`.pem`, `id_rsa`)
- SSL certificates and private keys
- AWS access keys

### 📦 Generated Files
- `__pycache__/`
- `node_modules/`
- `.next/`
- `venv/`

## 🛡️ Security Best Practices

### 1. Environment Variables
Always use environment variables for secrets:

```python
import os
API_KEY = os.getenv('OPENAI_API_KEY')
```

### 2. Frontend API Calls
**❌ NEVER expose backend secrets in frontend:**
```typescript
// DON'T DO THIS!
const apiKey = "sk-proj-..." // EXPOSED!
```

**✅ Always call through your backend:**
```typescript
// DO THIS!
await fetch('/api/tools/poem-generator', { ... })
```

### 3. AWS Security Groups
- Only allow port 80 (HTTP) and 443 (HTTPS)
- Restrict SSH (port 22) to your IP only
- Don't open unnecessary ports

### 4. Docker Security
- Don't run containers as root
- Use official base images only
- Scan images for vulnerabilities: `docker scan`

### 5. Rate Limiting
- Already configured in nginx.conf
- Prevents abuse and DDoS attacks
- Adjust based on your needs

## 🚨 What to Do If You Accidentally Commit Secrets

1. **Rotate the compromised credentials immediately**
2. Delete the secret from all git history:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if you're the only developer)
4. Consider the old secret compromised forever

## 🔍 How to Check for Exposed Secrets

```bash
# Check for accidentally committed secrets
git log --all --full-history -- .env
git log --all --full-history -- "*.pem"
```

## 📋 Pre-Deployment Checklist

Before deploying to EC2:
- [ ] Copy `.env.example` to `.env` with real values
- [ ] Update CORS origins in `main.py`
- [ ] Configure AWS Security Groups
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Enable CloudWatch logs
- [ ] Set up monitoring/alerts
- [ ] Test rate limiting
- [ ] Enable automatic backups

## 🆘 Security Contacts

If you discover a security vulnerability, please email:
- Your email here

---

Last updated: 2024

