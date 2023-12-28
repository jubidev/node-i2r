# Use the official Node.js image as the base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Create a volume for persisting stock.txt
VOLUME /app

# Start the application
CMD ["node", "app.js"]
#CMD ["tail", "-f", "/dev/null"]