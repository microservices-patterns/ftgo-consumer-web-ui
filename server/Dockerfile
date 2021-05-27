FROM node:12.22.1-alpine

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Copy app source
#COPY . /www
ADD src ./src
ENV PORT 8080
EXPOSE  8080
CMD npm run start
