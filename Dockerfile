FROM node:16
WORKDIR /usr/src/app
COPY handlers handlers
COPY util util
COPY app.js .
COPY package.json package.json
COPY start.sh start.sh
RUN npm run app:init
EXPOSE 8080
CMD [ "node", "app.js" ]
