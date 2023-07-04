FROM puppeteer/puppeteer:latest

# Update the system and install required libraries
RUN apt-get update && apt-get install -y \
    libxss1 \
    libgbm1 \
    libatk-bridge2.0-0 \
    libnss3

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
