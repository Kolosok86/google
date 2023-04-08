FROM alpine:latest
FROM node:19-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app
EXPOSE 4000

CMD ["node", "app.js" ]
