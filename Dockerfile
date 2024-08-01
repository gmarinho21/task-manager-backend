FROM node:lts-alpine

WORKDIR /code

COPY ./src ./src
COPY package.json ./
COPY package-lock.json ./

RUN npm install

CMD ["npm", "run", "start"]