# Deployment Guide

This guide covers deploying the Face Recognition System to various environments.

## 📋 Table of Contents

- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Considerations](#production-considerations)

## 🔧 Local Development

### Quick Start

```bash
# Using setup script
python setup.py

# Or manually
docker-compose -f docker-compose.dev.yml up
```

### Manual Setup

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python start_server.py
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Configuration

Edit `docker-compose.yml` for production settings:

```yaml
services:
  backend:
    environment:
      - LOG_LEVEL=WARNING
      - FACE_DETECTION_MODEL=hog
    restart: always

  frontend:
    restart: always
```

### Persistent Data

Data is stored in:

- `./backend/face_database/` - Face images and encodings
- `./backend/face_database/faces.db` - SQLite database

**Backup:**

```bash
# Create backup
tar -czf face_db_backup_$(date +%Y%m%d).tar.gz backend/face_database/

# Restore backup
tar -xzf face_db_backup_20251013.tar.gz
```

## ☁️ Cloud Deployment

### Docker Hub

```bash
# Build and tag images
docker build -t username/face-recognition-backend:latest ./backend
docker build -t username/face-recognition-frontend:latest ./frontend

# Push to Docker Hub
docker push username/face-recognition-backend:latest
docker push username/face-recognition-frontend:latest

# Pull and run on server
docker pull username/face-recognition-backend:latest
docker pull username/face-recognition-frontend:latest
docker-compose up -d
```

### AWS EC2

1. **Launch EC2 Instance**

   - Ubuntu 22.04 LTS
   - t3.medium or larger (2 vCPU, 4 GB RAM minimum)
   - Security group: Open ports 22, 80, 443, 3000, 8000

2. **Install Docker**

```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Deploy Application**

```bash
# Clone repository
git clone https://github.com/ArnavKarwa07/High_Speed_Face_Recognition.git
cd High_Speed_Face_Recognition

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update frontend .env with public IP
echo "VITE_API_URL=http://YOUR_PUBLIC_IP:8000" > frontend/.env

# Start services
docker-compose up -d
```

4. **Configure Domain (Optional)**

```bash
# Install nginx
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Configure nginx as reverse proxy
sudo nano /etc/nginx/sites-available/face-recognition

# Add configuration (see nginx.conf example below)
sudo ln -s /etc/nginx/sites-available/face-recognition /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

**Nginx Reverse Proxy Config:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Google Cloud Run

1. **Build and Push Images**

```bash
# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Build images
docker build -t gcr.io/YOUR_PROJECT_ID/face-recognition-backend:latest ./backend
docker build -t gcr.io/YOUR_PROJECT_ID/face-recognition-frontend:latest ./frontend

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/face-recognition-backend:latest
docker push gcr.io/YOUR_PROJECT_ID/face-recognition-frontend:latest
```

2. **Deploy to Cloud Run**

```bash
# Deploy backend
gcloud run deploy face-recognition-backend \
  --image gcr.io/YOUR_PROJECT_ID/face-recognition-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi

# Deploy frontend
gcloud run deploy face-recognition-frontend \
  --image gcr.io/YOUR_PROJECT_ID/face-recognition-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_URL=https://YOUR_BACKEND_URL
```

### Azure Container Instances

```bash
# Create resource group
az group create --name face-recognition-rg --location eastus

# Create container instances
az container create \
  --resource-group face-recognition-rg \
  --name face-recognition-backend \
  --image username/face-recognition-backend:latest \
  --dns-name-label face-rec-backend \
  --ports 8000

az container create \
  --resource-group face-recognition-rg \
  --name face-recognition-frontend \
  --image username/face-recognition-frontend:latest \
  --dns-name-label face-rec-frontend \
  --ports 80 \
  --environment-variables VITE_API_URL=http://face-rec-backend.eastus.azurecontainer.io:8000
```

## 🔒 Production Considerations

### Security

1. **Environment Variables**

   - Never commit `.env` files
   - Use secrets management (AWS Secrets Manager, GCP Secret Manager)
   - Rotate credentials regularly

2. **HTTPS**

   - Always use HTTPS in production
   - Use Let's Encrypt for free SSL certificates
   - Configure proper CORS origins

3. **Authentication**
   - Implement API authentication (JWT, OAuth)
   - Add rate limiting
   - Use API keys for external access

### Performance

1. **Scaling**

   - Horizontal scaling: Multiple backend workers
   - Load balancer for traffic distribution
   - Redis for session management

2. **Optimization**

   - Use CNN model only if GPU available
   - Enable response compression
   - Implement caching (Redis, Memcached)
   - Use CDN for static assets

3. **Database**
   - Consider PostgreSQL for production
   - Implement database backups
   - Use connection pooling

### Monitoring

1. **Application Monitoring**

   - Use `/health` and `/api/metrics` endpoints
   - Implement log aggregation (ELK, CloudWatch)
   - Set up alerting (PagerDuty, Opsgenie)

2. **Infrastructure Monitoring**
   - CPU, memory, disk usage
   - Network traffic
   - Container health

### Backup Strategy

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker exec face-recognition-backend \
  tar czf - /app/face_database > \
  $BACKUP_DIR/face_db_$DATE.tar.gz

# Keep last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

### Health Checks

Add to monitoring:

```bash
# Backend health
curl http://localhost:8000/health

# Frontend health
curl http://localhost:3000/

# Metrics
curl http://localhost:8000/api/metrics
```

### Troubleshooting

**Container won't start:**

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker ps -a

# Restart services
docker-compose restart
```

**Performance issues:**

```bash
# Check resource usage
docker stats

# Check metrics endpoint
curl http://localhost:8000/api/metrics

# Increase resources in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

**Database issues:**

```bash
# Access container
docker exec -it face-recognition-backend bash

# Check database
ls -lh /app/face_database/
sqlite3 /app/face_database/faces.db ".tables"
```

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Logging configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Health checks enabled
- [ ] Auto-restart configured
- [ ] Resource limits set
- [ ] Security scanning done
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment

## 🆘 Support

For deployment issues:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Check network connectivity
4. Review security groups/firewall
5. Open GitHub issue with details

---

**Need help?** Open an issue or consult the [README](README.md)
