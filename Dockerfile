FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --production || true

COPY . .

RUN npm run build || true

CMD ["node", "dist/index.js"]
