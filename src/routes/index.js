const HttpStatus = require('http-status-codes')
const bodyParser = require('body-parser')
const authMiddleware = require('../middleware/auth')
const loggingMiddleware = require('../middleware/logging')
// const hasPermissionMiddleware = require('../middleware/permissions');
const cors = require('cors')
const usersRouter = require('./usersRouter')
const orgsRouter = require('./orgsRouter')
const notifsRouter = require('./notifsRouter')
const offersRouter = require('./offersRouter')

const apiVersionString = require('../config/env').apiVersionString

module.exports = function (app) {
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.get('/', (req, res) => res.status(HttpStatus.OK).json('hello Ed!'))

  app.use(loggingMiddleware)
  app.use(authMiddleware)

  //linting test
  console.log('this' + ' is a test')

  app.use('/' + apiVersionString + '/users', usersRouter)
  app.use('/' + apiVersionString + '/orgs', orgsRouter)
  app.use('/' + apiVersionString + '/notifs', notifsRouter)
  app.use('/' + apiVersionString + '/offers', offersRouter)
}
