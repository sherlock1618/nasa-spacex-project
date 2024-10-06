FROM node:lts-alpine

WORKDIR /app

RUN npm install -g cross-env

COPY package*.json ./

COPY client/package*.json client/
RUN cd client && npm install client

COPY server/package*.json server/
RUN cd server && npm install server

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000
