FROM node:12.22.1-alpine

# Install app dependencies
RUN mkdir /www
COPY package.json /www
COPY package-lock.json /www
RUN cd /www
RUN npm i

# Copy app source
#COPY . /www
ADD src /www/src
WORKDIR /www
ENV PORT 8080
EXPOSE  8080
# start command as per package.json
CMD ["npm", "start"]
