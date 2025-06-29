# Use Node.js 20 slim as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Vue app for production
RUN npm run build

# Install a lightweight server to serve the static files
RUN npm install -g serve

# Expose port 3000 for the frontend
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "3000"]