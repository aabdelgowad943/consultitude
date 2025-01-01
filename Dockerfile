# Step 1: Build the Angular app
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Angular source code to the container
COPY . .

# Build the Angular app
RUN npm run build

# Step 2: Set up Nginx to serve the app
FROM nginx:stable-alpine AS production-stage

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Angular build artifacts to the Nginx directory
COPY --from=build-stage /app/dist/consultitude /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
