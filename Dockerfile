FROM node:12.11 AS ANGULAR_BUILD
RUN npm install -g @angular/cli@10.0.5
ARG BUILD_ENV=local
COPY . /app
WORKDIR /app

RUN npm install && ng build --configuration $BUILD_ENV

FROM nginx:1.19.2-alpine
COPY --from=ANGULAR_BUILD /app/dist/storeme /usr/share/nginx/html


