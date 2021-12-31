FROM node:14 as base

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


# RUN npm rebuild --verbose sharp
# RUN npm install bcrypt@latest --save

# If you are building your code for production
# RUN npm ci --only=production
EXPOSE 4001 
EXPOSE 4002

FROM base as dev

RUN npm install

ADD start-dev.sh / 
RUN chmod +x /start-dev.sh 
CMD ["sh", "./start-dev.sh"]

# Production
FROM base as prod
RUN npm ci --only=production
RUN npm install pm2@latest -g

# Bundle app source
COPY . ./
ADD start-prod.sh / 
RUN chmod +x /start-prod.sh 
CMD ["sh", "./start-prod.sh"]

