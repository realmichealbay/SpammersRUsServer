FROM ghcr.io/puppeteer/puppeteer:latest

# Change user to root
USER root

# Change working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install -g npm@latest
# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Change back to pptruser
USER pptruser

# Expose the port the app runs in
EXPOSE 4000

# Start the application
CMD [ "npm", "start" ]
