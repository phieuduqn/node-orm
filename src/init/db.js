import { Sequelize } from 'sequelize'
import config from '../configs'

const dbConfig = new Sequelize(config.db.db, config.db.user, config.db.password, {
  port: config.db.port,
  host: config.db.host,
  dialect: config.db.type || 'mysql',
  dialectOptions: { decimalNumbers: true },
  logging: false,
  logQueryParameters: false,
  pool: {
    min: 0,
    max: 5,
    acquire: 30000,
    idle: 10000,
  },
})
const initTransaction = async (req, res, next) => {
  req._transaction = await dbConfig.transaction().catch();

  return next()
}
const connectDb = async () => {
  return dbConfig.authenticate()
}

export {
  dbConfig,
  initTransaction,
  connectDb
}
