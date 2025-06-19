FROM node:20

WORKDIR /app

COPY package*.json /app/

COPY . /app

EXPOSE 5010

CMD ["npm", "run", "start:dev"]