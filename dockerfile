FROM ghcr.io/puppeteer/puppeteer:latest

# Change working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port the app runs in
EXPOSE 4000

# Start the application
CMD [ "npm", "start" ]
