FROM node:14-alpine as build
WORKDIR /app
COPY . /app

RUN yarn
RUN yarn build

COPY . /app

# ---

FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/package*.json /app/
COPY --from=build /app/dist/ /app/dist/

CMD ["node", "dist/main.js"]