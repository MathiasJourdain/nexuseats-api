# ==========================================
# STAGE 1 : BUILDER (Compilation du code)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ==========================================
# STAGE 2 : PROD-DEPS (Création des modules allégés)
# ==========================================
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma/

RUN npm pkg delete dependencies.prisma
RUN npm install --omit=dev --no-package-lock
RUN npx prisma generate

RUN rm -rf node_modules/@prisma/engines ~/.npm && \
    find node_modules -type f -name "*.map" -delete && \
    find node_modules -type f -name "*.md" -delete && \
    find node_modules -type f -name "*.ts" ! -name "*.d.ts" -delete && \
    find node_modules -type d -name "test" -exec rm -rf {} + && \
    find node_modules -type d -name "tests" -exec rm -rf {} +

# ==========================================
# STAGE 3 : PRODUCTION (Le Cheat Code DevOps)
# ==========================================
FROM alpine:3.19 AS production
WORKDIR /app
ENV NODE_ENV=production

# 🩹 LE PATCH : On ajoute openssl pour que Prisma puisse parler à la BDD
RUN apk add --no-cache nodejs openssl

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma/

EXPOSE 3000

CMD ["node", "dist/apps/nexuseats-api/main.js"]