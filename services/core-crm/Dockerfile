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

# Expose port (use ENV variable)
EXPOSE ${PORT}

# Create start script
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnpm start' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the server with migrations
CMD ["/app/start.sh"] 