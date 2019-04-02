const Cognito = require('aws-sdk/clients/cognitoidentityserviceprovider')
const cognitoISP = new Cognito({ apiVersion: '2016-04-18' })
const cognitoPoolId = require('../config/env').cognitoPoolId

let cognito = {}

cognito.addToCognitoGroup = circlesUser => {
  const groupName = 'user'
  const params = {
    GroupName: groupName,
    UserPoolId: cognitoPoolId,
    Username: circlesUser.username
  }
  return new Promise((resolve, reject) => {
    cognitoISP.adminAddUserToGroup(params, (err, data) => {
      if (err) reject(err)
      else {
        const formattedData = {}
        formattedData[groupName] = true
        formattedData.response = data
        resolve(formattedData)
      }
    })
  })
}

cognito.initAuth = authRequest => {
  return new Promise((resolve, reject) => {
    cognitoISP.adminInitiateAuth(authRequest, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

cognito.getUser = getUserRequest => {
  return new Promise((resolve, reject) => {
    cognitoISP.adminGetUser(getUserRequest, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

cognito.createUser = createUserRequest => {
  return new Promise((resolve, reject) => {
    cognitoISP.adminCreateUser(createUserRequest, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

cognito.confirmAuth = authConfirmRequest => {
  return new Promise((resolve, reject) => {
    cognitoISP.adminRespondToAuthChallenge(authConfirmRequest, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

cognito.deleteUser = deleteUserRequest => {
  return new Promise((resolve, reject) => {
    cognitoISP.adminDeleteUser(deleteUserRequest, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

cognito.updatePhone = (username, newPhoneNumber) => {
  var updatePhoneParams = {
    UserAttributes: [
      {
        Name: 'phone_number',
        Value: newPhoneNumber
      }
    ],
    UserPoolId: cognitoPoolId,
    Username: username
  }

  return new Promise((resolve, reject) => {
    cognitoISP.adminUpdateUserAttributes(updatePhoneParams, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports = cognito
