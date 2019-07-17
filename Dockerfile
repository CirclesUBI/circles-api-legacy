FROM mhart/alpine-node:8.11.0
WORKDIR /app

RUN apk --update add make gcc g++ python git

COPY package.json .
COPY contracts/package.json contracts/

RUN npm install && cd contracts && npm install

COPY . .

EXPOSE 8080