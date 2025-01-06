# Use a Node.js image
FROM node

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build the React app
RUN npm run build

EXPOSE 3000

# Start Nginx
CMD ["npm", "start"]
