const port = 3000
const config = require('./config/config')
const database = require('./config/database.config')
const app = require('express')()

let environment = process.env.NODE_ENV || 'development'

database(config[environment])

require('./config/expressJS')(app, config[environment])
require('./config/routes')(app)
require('./config/passport')()

app.listen(port)
