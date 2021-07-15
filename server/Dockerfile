FROM node:12.22.1-alpine

RUN echo "Building the backend server:"
RUN npx envinfo > ./envinfo.log
RUN cat ./envinfo.log

# Install app dependencies
COPY babel.config.js .
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Copy app source
#COPY . /www
ADD src ./src
ENV PORT=8080
EXPOSE 8080
RUN npm run build
CMD npx envinfo && npm run start
