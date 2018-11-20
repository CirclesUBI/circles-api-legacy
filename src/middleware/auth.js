import cognitoExpress from '../connections/cognito';
import AWS from 'aws-sdk';

const authMiddleWare = (req, res, next) => {
  const accessToken = req.headers.accesstoken;

  if (!accessToken) return res.status(401).send("Must provide accesstoken in header");

  cognitoExpress.validate(accessToken, function(err, response) {
    if (err) return res.status(401).send(err);
    console.log(response)
    res.locals.user = response;
    next();
  });
}

export default authMiddleWare;