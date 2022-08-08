FROM node:16
WORKDIR /usr/src/app
COPY app/handlers handlers
COPY app/util util
COPY app/app.js .
COPY package.json package.json
COPY start.sh start.sh
RUN npm run app:init
EXPOSE 8080
CMD [ "node", "app.js" ]
