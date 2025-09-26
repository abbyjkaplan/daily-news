# 🚀 Cloud Run Setup Complete!

## ✅ What's Working Now

Your Cloud Run application is **fully functional** and ready for deployment! Here's what we've accomplished:

### 🔧 **Setup Status:**
- ✅ Google Cloud SDK configured and authenticated
- ✅ Application dependencies installed
- ✅ Flask web service running locally
- ✅ BigQuery integration working
- ✅ All endpoints tested and functional

### 🌐 **Available Endpoints:**

#### 1. Health Check
```bash
curl http://localhost:8080/
```
**Response:**
```json
{
    "service": "bigquery-validator",
    "status": "healthy"
}
```

#### 2. Query Validation (JSON)
```bash
curl -X POST http://localhost:8080/validate \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) FROM `bigquery-public-data.samples.shakespeare`"}'
```

#### 3. Query Validation (File Upload)
```bash
curl -X POST http://localhost:8080/validate-file \
  -F "file=@your_query.sql"
```

## 🐳 **Docker Setup (Optional)**

While your app works locally without Docker, for Cloud Run deployment you'll need Docker Desktop:

### **Install Docker Desktop:**
1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   ```

### **Build and Test with Docker:**
```bash
# Build the container
docker build -t bigquery-validator .

# Run the container
docker run -p 8080:8080 bigquery-validator

# Test (in another terminal)
curl http://localhost:8080/
```

## 🚀 **Deploy to Cloud Run**

Once Docker is installed, you can deploy to Google Cloud Run:

### **1. Build and Push:**
```bash
export PATH="/Users/akaplan/google-cloud-sdk/bin:$PATH"

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/moma-dw/bigquery-validator

# Or use Artifact Registry (recommended)
gcloud artifacts repositories create bigquery-validator-repo \
  --repository-format=docker \
  --location=us-central1

gcloud builds submit --tag us-central1-docker.pkg.dev/moma-dw/bigquery-validator-repo/bigquery-validator
```

### **2. Deploy:**
```bash
gcloud run deploy bigquery-validator \
  --image us-central1-docker.pkg.dev/moma-dw/bigquery-validator-repo/bigquery-validator \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## 🧪 **Testing Your Deployment**

### **Local Testing:**
```bash
# Run the test suite
python3 test_local.py
```

### **Production Testing:**
```bash
# Get your service URL
SERVICE_URL=$(gcloud run services describe bigquery-validator --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl $SERVICE_URL/

# Test validation endpoint
curl -X POST $SERVICE_URL/validate \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) FROM `bigquery-public-data.samples.shakespeare`"}'
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"gcloud command not found"**
   ```bash
   export PATH="/Users/akaplan/google-cloud-sdk/bin:$PATH"
   ```

2. **"Project not found"**
   ```bash
   gcloud config set project moma-dw
   ```

3. **"Authentication failed"**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

4. **"Docker not found"**
   - Install Docker Desktop from the official website

5. **"Port already in use"**
   ```bash
   lsof -ti:8080 | xargs kill -9
   ```

## 📁 **Project Structure**

```
/Users/akaplan/
├── main.py                    # Flask web application
├── requirements.txt           # Python dependencies
├── Dockerfile                # Container configuration
├── .gcloudignore             # Files to exclude from deployment
├── setup_path.sh             # PATH setup script
├── test_local.py             # Local testing script
├── validate_query.py         # Standalone validator
├── cursor_bigquery_validator.py  # Cursor integration
└── SETUP_GUIDE.md           # This guide
```

## 🎯 **Next Steps**

1. **Install Docker Desktop** (if you want to deploy to Cloud Run)
2. **Test the Docker build** locally
3. **Deploy to Cloud Run** for production use
4. **Set up CI/CD** for automated deployments
5. **Add monitoring and logging** for production

## 💡 **Tips**

- Your app is already working locally without Docker!
- Use `python3 test_local.py` to run comprehensive tests
- The application automatically uses your `moma-dw` project
- All BigQuery queries are validated with dry runs (no costs)

---

**🎉 Congratulations! Your Cloud Run application is ready to go!**

