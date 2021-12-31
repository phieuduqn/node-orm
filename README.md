# node-orm
Nodejs Express Sequelize Redis 

# Steup Deploy
1. Run development mode
  `docker-compose -f docker-compose.dev.yml up --build --remove-orphans`
   Production mode 
 `docker-compose -f docker-compose.prod.yml up --build --remove-orphans`

You you want to delete all old containers and images, 
try `docker rm $(docker ps -a -q)` and `docker rmi $(docker images -q)`



```
# Install
npm install
npm install -g nodemon babel-node
# Run
npm run dev
```

## Test 
```
npm run test
```
## Start Queue
  1. Set Queue Port .env variable at path QUEUE_BOARD_PORT=
  2. Run command:
```
  npm run queue
```

## Install sequelize-cli
  `npm install --save sequelize-cli`
## Migration
  One migration file only run one time. U can't update code and run again. Please create new migrate for update.
  1. Create new migration
    `npx sequelize-cli migration:create --name create-table-user`
  2. Run migration
    `npx sequelize-cli db:migrate`

⚠️**WARNING** :  Be careful when run undo migrations. It will delete data and table schema.
  3. Undo most recent migrate
    `npx sequelize-cli db:migrate:undo` ⚠️**WARNING** 
  4. Undo all migrations
    `npx sequelize-cli db:migrate:undo:all` ⚠️**WARNING** 
  5. Undo back to migrations
    `npx sequelize-cli db:migrate:undo:all --to 'migraton-name'` ⚠️**WARNING** 
If u get limit by FOREIGN just access to sql console and SET FOREIGN_KEY_CHECKS=OFF; Run migration and set it ON again.


## Seeders
  Suppose we want to insert some data into a few tables by default. If we follow up on previous example we can consider creating a demo user for User table.

  To manage all data migrations you can use seeders. Seed files are some change in data that can be used to populate database table with sample data or test data.
  1. Create new seed
    `npx sequelize-cli seed:generate --name demo-user`
  2. Run Seed
    `npx sequelize-cli db:seed:all`
  3. Undo most recent seed
    `npx sequelize-cli db:seed:undo` ⚠️**WARNING** 
  4. Undo all seeds
    `npx sequelize-cli db:seed:undo:all` ⚠️**WARNING** 


## Error handling
To throw an custom error:
```
const errorObject = {
  code: -1,
  message: 'my custom error'
}
throw new Error(JSON.stringify(errorObject))

ex:
throw new Error(JSON.stringify(commonCode.dataAlreadyExisted))
```
The `errorObject` object will be sent to `error` variable in this call:
```
const [error, data] = await to(myFunction())
``` 

Other errors like system error...will be sent to `error` variable too.






## Build and Deploy to Docker Hub
1. Buid image:
```
docker build -t phuongtx/xp_api[:<tag>] .
```
2. Re-tagging an existing local image:
```
docker tag <existing-image> phuongtx/xp_api[:<tag>]
```
3. Login to docker:
```
docker login --username phuongtx
```
4. Push to docker hub:
```
docker push phuongtx/xp_api:<tag>
```


## Run Source using Docker:
1. Install Docker, Docker Compose
2. 
  Run development mode
    `docker-compose -f docker-compose.dev.yml up --build --remove-orphans`
  Production mode 
    `docker-compose -f docker-compose.prod.yml up --build --remove-orphans`

  You you want to delete all old containers and images, 
  try `docker rm $(docker ps -a -q)` and `docker rmi $(docker images -q)`

3. Go to the following links: 

    a. Api url: http://localhost:4001/api/v1

    b. Queue url: http://localhost:4002/admin/queues?token={QUEUE_TOKEN}


## Build image:
1. Login AWS ECR:
```
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin xxx47388275.dkr.ecr.eu-west-1.amazonaws.com
```
2. Build Image:
```
docker build -t xp_api .
```
3. Tag image:
```
docker tag xp_api:latest xxx47388275.dkr.ecr.eu-west-1.amazonaws.com/xp_api:latest
```
4. Push to ECR:
```
docker push xxx47388275.dkr.ecr.eu-west-1.amazonaws.com/xp_api:latest
```