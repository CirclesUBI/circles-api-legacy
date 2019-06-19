FROM mhart/alpine-node:10.1
WORKDIR /app
COPY . .

RUN apk --update add gcc make g++ zlib-dev

RUN npm install

EXPOSE 8080
CMD ["npm", "start" ]