#!/bin/bash

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
pm2 start ecosystem.config.js --env production --no-daemon