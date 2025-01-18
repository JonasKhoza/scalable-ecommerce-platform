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

# Copy the Consul registration script into the container
COPY register-consul.sh /app/register-consul.sh

# Installing curl
RUN apk add --no-cache curl 

RUN apk add --no-cache dos2unix

RUN dos2unix /app/register-consul.sh

# Make the script executable
RUN chmod +x ./register-consul.sh

# Run the Consul registration script during container startup
#CMD ["/bin/sh", "-c", "ls -la && cat ./register-consul.sh && ./register-consul.sh && npm start"]
#CMD ["/bin/sh", "-c", "ls -la && cat /app/register-consul.sh && /app/register-consul.sh && npm start"]
CMD ["/bin/sh", "-c", "/app/register-consul.sh && npm start"]
# CMD ["sh", "-c", "pwd && ls -la && cat ./register-consul.sh"]

#CMD ["npm", "start"]
#CMD ["/bin/sh", "-c", "./register-consul.sh && npm start"]
