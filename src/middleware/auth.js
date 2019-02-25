const cognitoPoolJWTToken = require('../config/env').cognitoPoolJWTToken

const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

const authMiddleWare = (req, res, next) => {
  const token = req.headers['accesstoken']

  if (token) {
    const pem = jwkToPem(cognitoPoolJWTToken)
    // verifies secret and checks exp
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function (
      err,
      decodedToken
    ) {
      if (err) {
        return res.sendStatus(402)
      }
      res.locals.user = decodedToken
      next()
    })
  } else {
    // if there is no token
    // return an error()
    return res.status(402).send({ error: 'Must provide accesstoken in header' })
  }
}

module.exports = authMiddleWare
