FROM node:16
WORKDIR /usr/src/app
COPY handlers .
COPY util .
COPY app.js .
COPY package.json .
COPY start.sh .
RUN npm run app:init
EXPOSE 8080
CMD [ "node", "app.js" ]
