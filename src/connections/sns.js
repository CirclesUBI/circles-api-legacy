const SNS = require('aws-sdk/clients/sns')

const sns = new SNS({apiVersion: '2010-03-31'})

module.exports = sns
