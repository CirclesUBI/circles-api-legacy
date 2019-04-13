const SNS = require('aws-sdk/clients/sns')

const sns = new SNS({ apiVersion: '2010-03-31' })

const androidGCMPlatformArn = require('../config/env').androidGCMPlatformArn

sns.createSNSEndpoint = circlesUser => {
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

sns.getSNSEndpoint = endpointArn  => {
  const params = {
    EndpointArn: endpointArn
  }
  console.log('arans', params)
  return new Promise((resolve, reject) => {
    sns.getEndpointAttributes(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

sns.updateSNSEndpoint = (deviceEndpoint, deviceId) => {
  const snsParams = {
    EndpointArn: deviceEndpoint,
    Attributes: {
      Token: deviceId,
      Enabled: true
    }
  }
  return new Promise((resolve, reject) => {
    sns.setEndpointAttributes(snsParams, (err, data) => {
      if (err) reject(err)
      else resolve(data.EndpointArn)
    })
  })
}

module.exports = sns
