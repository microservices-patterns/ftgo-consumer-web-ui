FROM node:12.22.1-alpine
RUN npx envinfo > ./envinfo.log
RUN cat ./envinfo.log
COPY package.json .
COPY package-lock.json .
RUN npm config set unsafe-perm true && npm install -g serve
RUN npm install
ADD src ./src
ADD public ./public
RUN npm run build
CMD npm run serve
