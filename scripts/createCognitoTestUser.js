const { cognitoISP } = require('../src/connections/cognito')
const fs = require('fs')

let saveFile = ''

const signUpRequest = { 
  "ClientId": process.env.COGNITO_CLIENT_ID_MOBILE,
  "Password": process.env.COGNITO_TEST_PASSWORD,
  "Username": process.env.COGNITO_TEST_USERNAME,
  "UserAttributes": [
    {
      "Name": 'phone_number',
      "Value": '+1111111111'
    },
    {
      "Name": 'email',
      "Value": 'test@joincircles.net'
    },
    {
      "Name": 'picture',
      "Value": 'https://cdn.dribbble.com/users/312581/screenshots/1676038/female-placeholder.png'
    }
  ]
}

cognitoISP.signUp(signUpRequest, (err, res) => {
  if (err) console.error(err)

  const confirmSignUpRequest = {
    "UserPoolId": process.env.COGNITO_POOL_ID,
    "Username": process.env.COGNITO_TEST_USERNAME  
  }
  cognitoISP.adminConfirmSignUp(confirmSignUpRequest, (err, res) => {
    if (err) console.error(err)

    const addToGroupRequest = {
      "Username": process.env.COGNITO_TEST_USERNAME,
      "GroupName": "test",
      "UserPoolId": process.env.COGNITO_POOL_ID
    }

    cognitoISP.adminAddUserToGroup(addToGroupRequest,  (err, res) => {
      if (err) console.error(err)
      console.log('succeded')

      // let modified = false
      // fs.readFileSync('.env').toString().split("\n").forEach( (line) => {  
      //   if (line.startsWith('COGNITO_TEST_USERNAME')) {
      //     line = line.split('=')[0] + '=' + process.env.COGNITO_TEST_USERNAME
      //     modified = true
      //   }
      //   saveFile += line.toString() + "\n" 
      // })
      // saveFile = saveFile.slice(0, -2)

      // fs.writeFile('.env', saveFile, 'utf8', function (err) {
      //   if (err) return console.error(err)
      // })
    })
  })  
})
