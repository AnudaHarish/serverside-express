#base image
FROM node:18.19.0-alpine AS builder

LABEL authors="anudaharishchandra"

#working directoty for the container
WORKDIR /app

COPY package.json ./

#copy all the files
COPY . .

#execute any command with run
RUN npm run build -- --configuration=production --base-href=/

#serve the application using nginx
FROM nginx:1.25-alpine

#remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

#copy built assets from builder
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

#copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d

#default port
EXPOSE 80

#executing the application when container start
CMD ["nginx","-g","daemon off;"]


