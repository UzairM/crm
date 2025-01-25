FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install serve for production static file serving
RUN npm install -g serve

# Copy source code
COPY . .

# Set environment variables for Docker services
ENV VITE_API_URL=https://help.elphinstone.us:3001
ENV VITE_CORE_CRM_URL=https://help.elphinstone.us:3001
ENV VITE_AI_SERVICE_URL=http://ai-service:8000
ENV VITE_ORY_SDK_URL=https://auth.elphinstone.us

# Build the app
RUN npm run build

# Expose port
ENV PORT=3000
EXPOSE ${PORT}

# Start the production server
CMD ["serve", "-s", "dist", "-l", "3000"] 