import cognitoExpress from '../connections/cognito';

const authMiddleWare = (req, res, next) => {
  const accessToken = req.headers.accesstoken;

  if (!accessToken) return res.status(401).send("Must provide accesstoken in header");

  cognitoExpress.validate(accessToken, (err, response) => {
    if (err) return res.status(401).send(err);
    console.log(response)
    res.locals.user = response;
    next();
  });
}

export default authMiddleWare;