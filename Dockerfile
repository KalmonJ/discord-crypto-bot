FROM node:21-bullseye-slim

WORKDIR /app

COPY . .

RUN npm install; npm run build;

CMD ["node", "dist/index.js"]