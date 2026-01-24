FROM node:18-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm install --production=false && npm run build
EXPOSE 4000
CMD ["node", "dist/index.js"]
