# Use Node.js 18
FROM node:18

# Create app directory in container
WORKDIR /app

# Install app dependencies
# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000 for react app
EXPOSE 3000

# Start the app
CMD ["npm", "start"]