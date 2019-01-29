const HttpStatus = require('http-status-codes');
const PostgresDB = require('../database').postgresDB;
const User = require('../models/user');
const androidGCMPlatformArn = require('../config/env').androidGCMPlatformArn;
const cognitoPoolId = require('../config/env').cognitoPoolId;
const logger = require('../lib/logger');
const cognitoISP = require('../connections/cognito');
const sns = require('../connections/sns');

// const AWS = require('aws-sdk')
// const SNS = new AWS.SNS({apiVersion: '2010-03-31'})


// todo: move this to FE
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
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function findOne (req, res) {
  const trx = await PostgresDB.startTransaction();
  try {
    const result = await User.query(trx).where({ id: req.params.id })
    const user = (result.length) ? result[0] : null
    if (user instanceof User) {
      user.notifications = await user.$relatedQuery('notifications')
      user.offers = await user.$relatedQuery('offers')
      user.organizations = await user.$relatedQuery('organizations')      
    }
    await trx.commit();
    res.status(HttpStatus.OK).send(user);
  } catch (error) {    
    logger.error(error.message)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

const userExample = { 
  id: 'da6c3e88-ff2d-49ce-a0b4-89f16029619b',
  agreedToDisclaimer: true,
  displayName: 'Rosina',
  email: 'Conner68@gmail.com',
  profilePicUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/haruintesettden/128.jpg',
  deviceId: '4',
  phoneNumber: '248.852.9171 x97910',
  deviceEndpoint: 'arn:aws:sns:eu-west-1:12345:endpoint/APNS_SANDBOX/blah-app/c08d3ccd-3e07-328c-a77d-20b2a790122f' 
}

async function addOne (req, res) {
  let user
  const trx = await PostgresDB.startTransaction();
  try {
    const circlesUser = req.body
    const userExists = await User.query(trx).where({ id: circlesUser.id })
    if (userExists.length) {      
      throw new Error('user.id already exists: ' + circlesUser.id)
    } else {
      const endpointArn = await sns.createSNSEndpoint(circlesUser)
      circlesUser.deviceEndpoint = endpointArn
      // await addToCognitoGroup(circlesUser)
      console.log(userExample)
      user = await User.query(trx).insert(userExample)
    }
    await trx.commit();
    res.status(HttpStatus.OK).send(user);              
  } catch (error) {
    logger.error(error.message)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

async function updateOne (req, res) {
  let user
  const trx = await PostgresDB.startTransaction();
  try {
    const userExists = await User.query(trx).where({ id: req.params.id })
    if (!userExists.length) {
      throw error('user.id does not exist: ' + req.params.id)      
    } else {
      user = await User.query(trx).patchAndFetchById(req.params.id, req.body)
    }
    await trx.commit();
    res.status(HttpStatus.OK).send(user);              
  } catch (error) {
    logger.error(error.message)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

function addToCognitoGroup (circlesUser) {
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

async function deleteOne (req, res) {
  const trx = await PostgresDB.startTransaction();
  try {
    const user = await User.query(trx).where({ id: req.params.id }).first()
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
    logger.error(error.message)
    await trx.rollback();
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

module.exports = {all, findOne, addOne, updateOne, deleteOne}
