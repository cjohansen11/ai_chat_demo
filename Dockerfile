FROM node:18

WORKDIR /user/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]