const port = process.env.PORT || 8080;

const defaultAppMsg = {
  msg: process.env.DEFAULT_APP_MSG ||
    `${process.env.NODE_ENV ? process.env.NODE_ENV : 'DEV'}: Circles user profile service`
}

const cognitoPoolId = process.env.COGNITO_POOL_ID;
const cognitoPoolRegion = process.env.COGNITO_POOL_REGION;

export {
  port,
  defaultAppMsg,
  cognitoPoolId,
  cognitoPoolRegion
}