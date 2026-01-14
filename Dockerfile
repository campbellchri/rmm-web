# Multi-stage Dockerfile for React + Vite application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source files
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_ENVIRONMENT
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL \
    VITE_ENVIRONMENT=$VITE_ENVIRONMENT \
    VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Build the application  
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder (Vite outputs to build/ by default)
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "OK"; \
        add_header Content-Type text/plain; \
    } \
    gzip on; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json; \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]