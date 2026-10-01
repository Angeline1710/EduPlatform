FROM node:20-alpine AS base
WORKDIR /app
ARG DATABASE_URL=postgresql://build:build@localhost:5432/edu_platform?schema=public

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npm run start"]
