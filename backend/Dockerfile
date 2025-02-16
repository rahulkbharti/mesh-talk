# Use Ubuntu as the base image
FROM ubuntu:latest

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && apt-get install -y nodejs npm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend app
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
