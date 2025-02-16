# Use Node.js for building React
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire frontend code and build
COPY . .
RUN npm run build

# Use Nginx for serving the React app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port for frontend
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
