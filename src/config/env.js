import { APIGateway } from "aws-sdk";

const port = process.env.PORT || 8080;

const defaultAppMsg = {
  msg: process.env.DEFAULT_APP_MSG ||
    `${process.env.NODE_ENV ? process.env.NODE_ENV : 'DEV'}: Circles user profile service, deployed from ECR with AWS Codepipeline`
}

const cognitoPoolId = process.env.COGNITO_POOL_ID;
const cognitoPoolRegion = process.env.COGNITO_POOL_REGION;
const androidGCMPlatformArn = process.env.ANDROID_GCM_PLATFORM_ARN

const postgres = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'postgres'
};

const api = {
  versionString: process.env.API_VERSION
}

export {
  api,
  port,
  defaultAppMsg,
  cognitoPoolId,
  cognitoPoolRegion,
  androidGCMPlatformArn,
  postgres
}
