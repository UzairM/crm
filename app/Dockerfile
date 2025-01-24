FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
ENV PORT=3000
EXPOSE ${PORT}

# Start the server
CMD ["npm", "run", "start"] 