// import * as HttpStatus from 'http-status-codes';
// import { findUser, userValidator } from '../validators/userValidator';
import PostgresDB from '../database';
import User from '../models/user';

import { androidGCMPlatformArn } from '../config/env';

var Cognito = require('aws-sdk/clients/cognitoidentityserviceprovider')
var cognitoISP = new Cognito({apiVersion: '2016-04-18'})
var SNS = require('aws-sdk/clients/sns')
var sns = new SNS({apiVersion: '2010-03-31'})

function convertCognitoToUser (cognitoUser) {
  return {
    agreedToDisclaimer: false,
    id: cognitoUser.sub,
    deviceId: cognitoUser['custom:deviceId'],
    email: cognitoUser.email,
    displayName: cognitoUser.name,
    phoneNumber: cognitoUser.phone_number,
    profilePicUrl: cognitoUser.picture
  }
}

async function all (req, res) {
  console.log('all!')
  const trx = await PostgresDB.startTransaction();
  try {
    const users = await trx.select('*').from('user').limit(10);
    await trx.commit();
    res.status(200).send(users);
  } catch (error) {
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

async function findOne (req, res) {
  console.log('findOne!')
  const trx = await PostgresDB.startTransaction();
  try {
    let result = await User.query(trx).where({ id: req.params.id })
    let user = (result.length) ? result[0] : null
    await trx.commit();
    res.status(200).send(user);
  } catch (error) {    
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

async function addOne (req, res) {
  console.log('addOne!')
  const trx = await PostgresDB.startTransaction();
  try {
    const userExists = await User.query(trx).where({ id: req.params.id })
    if (userExists.length) throw new Error('user.id exists: ' + req.params.id)
    let circlesUser = convertCognitoToUser(req.body)
    const endpointArn = await createSNSEndpoint(circlesUser)
    circlesUser.deviceEndpoint = endpointArn
    const newUser = await User.query(trx).insert(circlesUser)
    await addToCognitoGroup(circlesUser)    
    await trx.commit();
    res.status(200).send(newUser);              
  } catch (error) {
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

function addToCognitoGroup (circlesUser) {
  console.log('addToCognitoGroup')
  const groupName = 'user'
  var params = {
    GroupName: groupName,
    UserPoolId: process.env.COGNITO_POOL_ID,
    Username: circlesUser.id
  }
  return new Promise((resolve, reject) => {
    cognitoISP.adminAddUserToGroup(params, (err, data) => {
      if (err) reject(err)
      else {
        console.log('finished addToCognitoGroup', data)
        const formattedData = {}
        formattedData[groupName] = true
        formattedData.response = data
        resolve(formattedData)
      }
    })
  })
}

function createSNSEndpoint (circlesUser) {
  console.log('createSNSEndpoint', androidGCMPlatformArn)
  var snsParams = {
    PlatformApplicationArn: androidGCMPlatformArn,
    Token: circlesUser.deviceId
  }
  return new Promise((resolve, reject) => {
    sns.createPlatformEndpoint(snsParams, (err, data) => {
      if (err) reject(err)
      else {
        console.log('finished createSNSEndpoint', data)
        resolve(data.EndpointArn)
      }
    })
  })
}

async function updateOne (req, res) {
  console.log('updateOne!')
  const trx = await PostgresDB.startTransaction();
  try {
    const patchedUser = await User.query(trx).patchAndFetchById(req.params.id, req.body)
    await trx.commit();
    res.status(200).send(patchedUser);
  } catch (error) {
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

async function deleteOne (req, res) {
  console.log('deleteOne!')
  const trx = await PostgresDB.startTransaction();
  try {
    const result = await User.query(trx).delete().where({ id: req.params.id })
    if (!result) throw new Error('No user.id: ' + req.params.id)
    await trx.commit();
    res.status(200).send();
  } catch (error) {
    console.error(error)
    await trx.rollback();
    res.status(500).send(error);
  }
}

export default {all, findOne, addOne, updateOne, deleteOne}