import * as HttpStatus from 'http-status-codes';
import { cognitoPoolJWTToken } from '../config/env'

const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

const authMiddleWare = (req, res, next) => {
  const token = req.headers['accesstoken']
  // decode token
  if (token) {
    const pem = jwkToPem(cognitoPoolJWTToken)
    // verifies secret and checks exp
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
      if (err) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED) })
      }
      req.decodedToken = decodedToken
      next()
    })
  } else {
    // if there is no token
    // return an error()
    return res.status(HttpStatus.UNAUTHORIZED).send({ error: "Must provide accesstoken in header" });
  }
}

export default authMiddleWare
