# Use an official Node runtime as the base image
FROM node:latest

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Install application dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside Docker image
COPY . .

# The app is run by launching the server.js file
CMD [ "node", "app.js" ]

# Expose the port the app runs on
EXPOSE 4000
