const { cognito } = require('../src/connections/cognito');
const fs = require('fs')

const authRequest = {
  "AuthFlow": "ADMIN_NO_SRP_AUTH",
  "AuthParameters": { 
     "USERNAME": process.env.COGNITO_TEST_PHONE,
     "PASSWORD": process.env.COGNITO_TEST_PASSWORD
  },
  "ClientId": process.env.COGNITO_CLIENT_ID_API,
  "UserPoolId": process.env.COGNITO_POOL_ID
}

let saveFile = ''

cognito.initAuth(authRequest).then( res => {
  console.log('accesstoken:', res.AuthenticationResult.AccessToken)
  let modified = false
  fs.readFileSync('.env').toString().split("\n").forEach( (line) => {  
    if (line.startsWith('AUTH_ACCESS_TOKEN')) {
      line = line.split('=')[0] + '=' + res.AuthenticationResult.AccessToken
      modified = true
    }
    saveFile += line.toString() + "\n" 
  })
  saveFile = saveFile.slice(0, -2)

  if (!modified) saveFile +=  'AUTH_ACCESS_TOKEN=' + res.AuthenticationResult.AccessToken

  fs.writeFile('.env', saveFile, 'utf8', function (err) {
    if (err) return console.error(err);
  });
})
