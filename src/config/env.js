const port = process.env.PORT || 8080

const defaultAppMsg = {
  msg:
    process.env.DEFAULT_APP_MSG ||
    `${
      process.env.NODE_ENV ? process.env.NODE_ENV : 'DEV'
    }: Circles user profile service, deployed from ECR with AWS Codepipeline`
}

// AWS stuff
const cognitoPoolId = process.env.COGNITO_POOL_ID
const cognitoPoolRegion = process.env.COGNITO_POOL_REGION
const androidGCMPlatformArn = process.env.ANDROID_GCM_PLATFORM_ARN

// https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_hqooY4ZrH/.well-known/jwks.json
// PICK THE SECOND ONE!!!!
const cognitoPoolJWTToken = {
  alg: 'RS256',
  e: 'AQAB',
  kid: process.env.COGNITO_POOL_JWT_KID,
  kty: 'RSA',
  n: process.env.COGNITO_POOL_JWT_N,
  use: 'sig'
}

const postgres = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'postgres'
}

// API stuff
const apiVersionString = process.env.npm_package_version
  ? 'v' + process.env.npm_package_version
  : process.env.API_VERSION

module.exports = {
  apiVersionString,
  port,
  defaultAppMsg,
  cognitoPoolId,
  cognitoPoolJWTToken,
  cognitoPoolRegion,
  androidGCMPlatformArn,
  postgres
}
