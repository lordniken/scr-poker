FROM node:14-alpine as build
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install --frozen-lockfile
COPY . /app
RUN yarn build

FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]