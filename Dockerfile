FROM node:12.22.1-alpine
#FROM ftgo-consumer-web-ui_server:latest
RUN npx envinfo > ./envinfo.log
RUN cat ./envinfo.log

COPY package.json .
COPY package-lock.json .
RUN npm config set unsafe-perm true && npm install -g serve
ENV NODE_OPTIONS --max_old_space_size=819
ENV PUPPETEER_SKIP_DOWNLOAD true
RUN npm ci
ADD src ./src
ADD public ./public

ARG REACT_APP_BACKEND_API_URL
RUN echo "REACT_APP_BACKEND_API_URL: $REACT_APP_BACKEND_API_URL"

RUN npm run build:slim
CMD npm run serve
