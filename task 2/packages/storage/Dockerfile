FROM node:18
WORKDIR /usr/src/app/
COPY ./packages/storage/package*.json ./packages/storage/
RUN npm --prefix ./packages/storage/ ci
COPY ./package*.json ./
COPY ./packages/storage/tsconfig.json ./
RUN npm ci
COPY ./packages/storage/ ./packages/storage/
COPY ./packages/common/ ./packages/common/
RUN npm --prefix ./packages/storage/ run build
