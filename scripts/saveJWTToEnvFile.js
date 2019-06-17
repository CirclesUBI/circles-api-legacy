const request = require('request')
const fs = require('fs')

// https://cognito-idp.eu-central-1.amazonaws.com/%cognito_userpool_id%/.well-known/jwks.json
let JWTUrl = 'https://cognito-idp.' 
    + process.env.AWS_REGION 
    + '.amazonaws.com/'
    + process.env.COGNITO_POOL_ID
    + '/.well-known/jwks.json'

console.log('Requesting JWT token from url:', JWTUrl)

request(JWTUrl, function (error, response, body) {
  console.error('error:', error) 
  let keys = JSON.parse(body).keys
  console.log('statusCode:', response && response.statusCode)  
  if (response && response.statusCode === 200) {
    let kid = keys[1].kid
    let n = keys[1].n

    let saveFile = ''
    let modified = false
    fs.readFileSync('.env').toString().split('\n').forEach( (line) => {  
      if (line.startsWith('COGNITO_POOL_JWT_KID')) {
        line = line.split('=')[0] + '=' + kid
        modified = true
      }
      else if (line.startsWith('COGNITO_POOL_JWT_N')) {
        line = line.split('=')[0] + '=' + n
        modified = true
      }
      saveFile += line.toString() + '\n'
    })
    saveFile = saveFile.slice(0, -2)

    fs.writeFile('.env', saveFile, 'utf8', function (err) {
        if (err) return console.error(err)
        else console.log('succeeded')
    })
  }
  else console.log('body:', body)
})
