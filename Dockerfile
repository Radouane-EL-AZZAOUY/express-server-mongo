FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY server.js ./
COPY backend ./backend
COPY frontend ./frontend

RUN mkdir -p /app/data

EXPOSE 80

CMD ["npm", "start"]

