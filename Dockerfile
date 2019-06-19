FROM mhart/alpine-node:8
WORKDIR /app
COPY . .

RUN apk --update add make gcc g++ python git

RUN npm install && cd src/connections/metatx-server && npm install

EXPOSE 8080
CMD ["npm", "start" ]