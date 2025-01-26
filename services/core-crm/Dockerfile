FROM node:22.12.0

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Default port
ENV PORT=3001

# Set environment variables for build and runtime
ENV NODE_ENV=production
ENV ORY_SDK_URL=https://auth.elphinstone.us
ENV AI_SERVICE_URL=http://ai-service:8000
ENV JWT_SECRET=your-secret-key
ENV JWT_EXPIRES_IN=24h
ENV FRONTEND_URL=https://help.elphinstone.us
ENV ALLOWED_ORIGINS=https://help.elphinstone.us
ENV DATABASE_URL=postgresql://admin:admin123@postgres:5432/crm_db

# Expose port (use ENV variable)
EXPOSE ${PORT}

# Create start script
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnpm start' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the server with migrations
CMD ["/app/start.sh"] 