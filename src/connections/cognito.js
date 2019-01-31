const Cognito = require('aws-sdk/clients/cognitoidentityserviceprovider')

const cognitoISP = new Cognito({apiVersion: '2016-04-18'})

const cognitoPoolId = require('../config/env').cognitoPoolId;

cognitoISP.addToCognitoGroup = (circlesUser) => {
  const groupName = 'user'
  const params = {
    GroupName: groupName,
    UserPoolId: cognitoPoolId,
    Username: circlesUser.id
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

module.exports = cognitoISP
