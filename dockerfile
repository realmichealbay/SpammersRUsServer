# Use an official Puppeteer runtime as a parent image
FROM puppeteer/puppeteer:latest

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Start the app
CMD [ "npm", "start" ]
