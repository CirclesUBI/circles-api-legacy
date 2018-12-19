import * as HttpStatus from 'http-status-codes';
import PostgresDB from '../database';
import User from '../models/user';

import { androidGCMPlatformArn } from '../config/env';

import logger from '../lib/logger'

import cognitoISP from '../connections/cognito'
import sns from '../connections/sns'

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
  try {
    const users = await User.query().limit(10);
    res.status(HttpStatus.OK).send(users);
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function findOne (req, res) {
  const trx = await PostgresDB.startTransaction();
  try {
    let result = await User.query(trx).where({ id: req.params.id })
    let user = (result.length) ? result[0] : null
    if (user instanceof User) {
      user.notifications = await user.$relatedQuery('notifications')
      user.organizations = await user.$relatedQuery('organizations')
    }
    await trx.commit();
    res.status(HttpStatus.OK).send(user);
  } catch (error) {    
    logger.error(error)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function addOne (req, res) {
  let user
  const trx = await PostgresDB.startTransaction();
  try {
    const userExists = await User.query(trx).where({ id: req.params.id })
    if (userExists.length) {
      logger.warn('user.id exists: ' + req.params.id)
      user = await User.query(trx).patchAndFetchById(req.params.id, req.body)
    } else {
      let circlesUser = convertCognitoToUser(req.body)
      const endpointArn = await createSNSEndpoint(circlesUser)
      await addToCognitoGroup(circlesUser)
      circlesUser.deviceEndpoint = endpointArn
      user = await User.query(trx).insert(circlesUser)
    }
    await trx.commit();
    res.status(HttpStatus.OK).send(user);              
  } catch (error) {
    logger.error(error)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

function addToCognitoGroup (circlesUser) {
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
        const formattedData = {}
        formattedData[groupName] = true
        formattedData.response = data
        resolve(formattedData)
      }
    })
  })
}

function createSNSEndpoint (circlesUser) {
  var snsParams = {
    PlatformApplicationArn: androidGCMPlatformArn,
    Token: circlesUser.deviceId
  }
  return new Promise((resolve, reject) => {
    sns.createPlatformEndpoint(snsParams, (err, data) => {
      if (err) reject(err)
      else resolve(data.EndpointArn)
    })
  })
}

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction();
  try {
    let user = await User.query(trx).where({ id: req.params.id }).first()
    if (user instanceof User) {
      await user.$relatedQuery('organizations').unrelate()
      await user.$relatedQuery('notifications').delete().where({ user_id: req.params.id })
      await User.query(trx).delete().where({ id: req.params.id })
    } else {
      throw new Error('No user.id: ' + req.params.id)
    }
    await trx.commit();
    res.status(HttpStatus.OK).send();
  } catch (error) {
    logger.error(error)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

export default {all, findOne, addOne, deleteOne}
