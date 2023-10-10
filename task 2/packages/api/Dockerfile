FROM node:18
WORKDIR /usr/src/app/
COPY ./packages/api/package*.json ./packages/api/
RUN npm --prefix ./packages/api/ ci
COPY ./package*.json ./
COPY ./packages/api/tsconfig.json ./
RUN npm ci
COPY ./packages/api/ ./packages/api/
COPY ./packages/common/ ./packages/common/
RUN npm --prefix ./packages/api/ run build
