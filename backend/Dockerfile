#base image
FROM node:14.21.3-alpine

LABEL authors="anudaharishchandra"

#working directoty for the container
WORKDIR /app

COPY package.json ./

#copy all the files
COPY . .

#execute any command with run
RUN npm install

EXPOSE 3500

#executing the application when container start
CMD ["node","server.js"]