FROM node:12.6.0

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 4000

CMD ["npm", "start"]
