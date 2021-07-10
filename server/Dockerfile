FROM node:14-alpine as build
WORKDIR /app
COPY . /app

RUN yarn
RUN yarn build
CMD [ "yarn", "start" ]