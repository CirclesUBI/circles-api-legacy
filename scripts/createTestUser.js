const { cognitoISP } = require('../src/connections/cognito')
const fs = require('fs')
const request = require('request')

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
      "Name": 'name',
      "Value": 'Test User'
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
  if (err) {
    console.error(err)    
    return console.log('exiting ...')
  } 
  console.log('Signed up.')

  const confirmSignUpRequest = {
    "UserPoolId": process.env.COGNITO_POOL_ID,
    "Username": process.env.COGNITO_TEST_USERNAME  
  }
  cognitoISP.adminConfirmSignUp(confirmSignUpRequest, (err, res) => {
    if (err) console.error(err)
    console.log('Confirmed signup.')

    const addToGroupRequest = {
      "Username": process.env.COGNITO_TEST_USERNAME,
      "GroupName": "admin",
      "UserPoolId": process.env.COGNITO_POOL_ID
    }

    cognitoISP.adminAddUserToGroup(addToGroupRequest,  (err, res) => {
      if (err) console.error(err)
      console.log('Test cognito user created.')

      const getUserRequest = {"Username": process.env.COGNITO_TEST_USERNAME, "UserPoolId": process.env.COGNITO_POOL_ID}

      cognitoISP.adminGetUser(getUserRequest, (err, res) => {
        if (err) console.error(err)
        let userAttributes = {}
        res.UserAttributes.map( attrib => {
          userAttributes[attrib.Name] = attrib.Value
        })
        userAttributes.username = res.Username
        userAttributes['custom:device_id'] = 'bae51c696917ca-a9c67e959aef34-5af5a8f43ac1bdadd6fca-c92987ca66a21bb'

        const authRequest = {
          "AuthFlow": "ADMIN_NO_SRP_AUTH",
          "AuthParameters": { 
            "USERNAME": process.env.COGNITO_TEST_USERNAME,
            "PASSWORD": process.env.COGNITO_TEST_PASSWORD
          },
          "ClientId": process.env.COGNITO_CLIENT_ID_API,
          "UserPoolId": process.env.COGNITO_POOL_ID
        }
                
        cognitoISP.adminInitiateAuth(authRequest, (err, res) => {
          if (err) console.error(err)
          console.log('Logged in.')
          const token = res.AuthenticationResult.AccessToken
          let reqUrl = 'http://localhost:8080/' + process.env.API_VERSION + '/users'

          request.post({
            url: reqUrl,
            body: userAttributes,
            json: true,
            headers: {
              accesstoken: token
            }
          }, function(error, response, body) {
            if (error) console.error(error)
            if (!error && response.statusCode == 201) {
              console.log('Created DB user record:')
              console.log(body);
            }          
          })
        })
      })
    })
  })  
})
