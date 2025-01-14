# Use the official Node.js image from the Docker Hub
FROM node:22.12-alpine3.20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Command to run the compiled JavaScript
CMD ["npm", "start"]
