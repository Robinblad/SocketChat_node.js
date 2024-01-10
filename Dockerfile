FROM node:18.17-alpine

EXPOSE 3000

# Install npm globally
RUN npm install -g npm

# Install system dependencies required for node modules
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the Docker image
COPY package*.json ./

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of your application code to the Docker image
COPY . .

CMD ["npm", "run", "start"]