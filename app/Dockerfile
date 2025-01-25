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

# Build the app
RUN npm run build

# Expose port
ENV PORT=3000
EXPOSE ${PORT}

# Start the production server
CMD ["serve", "-s", "dist", "-l", "3000"] 