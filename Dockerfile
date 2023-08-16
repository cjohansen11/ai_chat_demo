FROM node:18

WORKDIR /user/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "./build/index.js"]