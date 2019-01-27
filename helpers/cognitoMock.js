const _ = require('lodash');
const aws = require('aws-sdk');
const awsMock = require('aws-sdk-mock');
const Promise = require('bluebird');

aws.config.setPromisesDependency(Promise);
awsMock.setSDKInstance(aws);

const users = {};
const methodCalls = {};


awsMock.mock('CognitoIdentityServiceProvider', 'adminAddUserToGroup', (params, callback) => {
  if (!_.has(users, params.Username)) {
    return callback(new Error('User does not exist'));
  }
  methodCalls.adminUpdateUserAttributes = params.Username;
  _.each(
    params.UserAttributes,
    attr => _.remove(users[params.Username].UserAttributes, savedAttr => attr.Name === savedAttr.name)
  );
  users[params.Username].UserAttributes = _.concat(users[params.Username].UserAttributes, params.UserAttributes);
  return callback();
});

awsMock.mock('CognitoIdentityServiceProvider', 'adminGetUser', (params, callback) => {
  if (!_.has(users, params.Username)) {
    return callback(new Error('User does not exist'));
  }
  methodCalls.adminGetUser = params.Username;
  return callback(null, users[params.Username]);
});

awsMock.mock('CognitoIdentityServiceProvider', 'adminUpdateUserAttributes', (params, callback) => {
  if (!_.has(users, params.Username)) {
    return callback(new Error('User does not exist'));
  }
  methodCalls.adminUpdateUserAttributes = params.Username;
  _.each(
    params.UserAttributes,
    attr => _.remove(users[params.Username].UserAttributes, savedAttr => attr.Name === savedAttr.name)
  );
  users[params.Username].UserAttributes = _.concat(users[params.Username].UserAttributes, params.UserAttributes);
  return callback();
});

awsMock.mock('CognitoIdentityServiceProvider', 'adminDeleteUser', (params, callback) => {
  if (!_.has(users, params.Username)) {
    return callback(new Error('User does not exist'));
  }
  methodCalls.adminDeleteUser = params.Username;
  delete users[params.Username];
  return callback();
});

const CognitoMock = module.exports;
CognitoMock.getMock = () => new aws.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });
CognitoMock.getMethodCalls = () => methodCalls;
