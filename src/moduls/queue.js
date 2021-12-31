require('dotenv').config()
require('babel-register')

require('./queue/index.js').default()
// Extenal Moduls Run On different process and port
