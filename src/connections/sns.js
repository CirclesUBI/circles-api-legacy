const SNS = require('aws-sdk/clients/sns')

const sns = new SNS({apiVersion: '2010-03-31'})

const androidGCMPlatformArn = require('../config/env').androidGCMPlatformArn;

sns.createSNSEndpoint = (circlesUser) => {
  const snsParams = {
    PlatformApplicationArn: androidGCMPlatformArn,
    Token: circlesUser.device_id
  }  
  return new Promise((resolve, reject) => {
    sns.createPlatformEndpoint(snsParams, (err, data) => {
      if (err) reject(err)
      else resolve(data.EndpointArn)
    })
  })
}

module.exports = sns
