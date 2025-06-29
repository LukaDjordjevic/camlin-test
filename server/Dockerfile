# Use Node.js 20 slim as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose port 3001 for the backend
EXPOSE 3001

# Start the Express server
# CMD ["node", "server.ts"]
# CMD ["npm", "run", "server.ts"]
CMD ["npx", "ts-node", "server.ts"]
