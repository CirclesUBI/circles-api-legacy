const Cognito = require('aws-sdk/clients/cognitoidentityserviceprovider')

const cognitoISP = new Cognito({apiVersion: '2016-04-18'})

module.exports = cognitoISP
