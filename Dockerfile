FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm run app:init
EXPOSE 8080
CMD [ "node", "app.js" ]
