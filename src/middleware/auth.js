// import cognitoExpress from '../connections/cognito';

// const authMiddleWare = (req, res, next) => {
//   const accessToken = req.headers.accesstoken;

//   if (!accessToken) return res.status(401).send("Must provide accesstoken in header");

//   cognitoExpress.validate(accessToken, (err, response) => {
//     if (err) return res.status(401).send(err);
//     res.locals.user = response;
//     next();
//   });
// }

// export default authMiddleWare;

//  https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_198tc9lcH/.well-known/jwks.json

const jwk1 = {'alg': 'RS256', 'e': 'AQAB', 'kid': 'ud4jOB8u/nJ5nnIth/TqgdQmBix2PM515WwmHGg4cqc=', 'kty': 'RSA', 'n': 'mpwSCfKEyy8QC25vNrudkBNfFNd6XUhN3LxbV6ObiMMbZDCJ1vM7vJmYFbZNq0eHYkle1eOMEAEkNcDkz3yqqA2mJQfJDtHpv-V8YpDU5J-VY8zGcTEU53G8L2mYaxJXJkBPLKA04erj3b9bDelxcv9WJetMHC2arnS_6-d1p-95nC_CdJeZyS9gVNaTbTPGO13PYNJr-klExKCspTadI4Afn4zKEkJHsd6L63F8t4kmfVjKnBnfM5t6lhVbk1Ovh0ApTZJVKHkM32Q58H-nDo32G2Okd6fiMXWweT6FbJGzr80uy46uYrryJpqJ6nzoL0KO4QKwgRyab_3jitUthQ', 'use': 'sig'}
const jwk2 = {'alg': 'RS256', 'e': 'AQAB', 'kid': 'itTsg6kTqcCuodUF9b6UkPmZ4LDKvTagSp7KHnhE3rw=', 'kty': 'RSA', 'n': 'idEol-eEytjLj7uWjz2ZQovb_qum3dind7PxAeCT5Jor7ndZc0sj-ZvcAU0IyUANZhLdET5s-lR-cvm0D7TUtcrilNlaiz1ZmL_gX6PxEXCC66BE_KBzgQhVZBJ0sj7eNtH7puCFlpxOIuzExkhVEtNgtXynaa-EFNCRsLhLv1XQ_cHHLqL5aC7wzn_RhZj40O6mQKXQTNKbwxx3wWJ-J8UtudhdgFdWjtKXBOdOY6V-VOTQnzIkZgDppT3XrVXApSmnFJVGncWw3vElueAkD68kr3bEktN8qfMSNKl-3XeVi3ZxiFuaSkwGFxodFtdyXMyouXU9wKkIQYTKGTDeuQ', 'use': 'sig'}

const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

const authMiddleWare = (req, res, next) => {
  const token = req.headers['accesstoken']

  // decode token
  if (token) {
    const pem = jwkToPem(jwk2)
    // verifies secret and checks exp
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
      if (err) return res.status(401).send(err)
      req.decodedToken = decodedToken
      next()
    })
  } else {
    // if there is no token
    // return an error
    return res.status(401).send('Must provide accesstoken in header')
  }
}

export default authMiddleWare
