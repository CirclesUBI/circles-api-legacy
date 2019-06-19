FROM mhart/alpine-node:10.1
WORKDIR /app
COPY . .

RUN apk --update add make gcc g++ python

RUN npm install

EXPOSE 8080
CMD ["npm", "start" ]