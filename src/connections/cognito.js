import CognitoExpress from "cognito-express";
import { cognitoPoolId, cognitoPoolRegion } from '../config/env';

const cognitoExpress = new CognitoExpress({
    region: cognitoPoolRegion,
    cognitoUserPoolId: cognitoPoolId,
    tokenUse: "access", // Possible Values: access | id
    tokenExpiration: 3600000 // 1 hour expiry
});

export default cognitoExpress;