FROM node:18.16.0-alpine
ADD . /app
WORKDIR /app
RUN npm install && npm run build
RUN npm install -g serve http-proxy-middleware
CMD ["npm", "run", "start:prod"]
