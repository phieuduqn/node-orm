FROM node:14 as base

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# RUN npm rebuild --verbose sharp
# RUN npm install bcrypt@latest --save
RUN npm install pm2@latest -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./

EXPOSE 4001 
EXPOSE 4002

FROM base as dev

ADD start-dev.sh / 
RUN chmod +x /start-dev.sh 
CMD ["sh", "./start-dev.sh"]

# Production
FROM base as prod

ADD start-prod.sh / 
RUN chmod +x /start-prod.sh 
CMD ["sh", "./start-prod.sh"]

