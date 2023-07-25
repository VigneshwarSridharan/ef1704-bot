FROM node:latest

WORKDIR /home/app

COPY . .

CMD [ "npm", "start" ]