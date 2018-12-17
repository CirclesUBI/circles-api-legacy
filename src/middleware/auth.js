//  https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_198tc9lcH/.well-known/jwks.json
import { cognitoPoolJWTToken } from '../config/env'

const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

const authMiddleWare = (req, res, next) => {
// check header or url parameters or post parameters for token
  // console.log(req.body, req.query, req.headers)
  const token = req.headers['accesstoken']

  // decode token
  if (token) {
    const pem = jwkToPem(cognitoPoolJWTToken)
    // verifies secret and checks exp
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
      if (err) return res.status(401).send(err)
      req.decodedToken = decodedToken
      next()
    })
  } else {
    // if there is no token
    // return an error
    return res.status(401).send("Must provide accesstoken in header");
  }
}

export default authMiddleWare
