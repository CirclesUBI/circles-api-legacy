const port = process.env.PORT || 8080;
const defaultAppMsg = {
  msg: process.env.DEFAULT_APP_MSG ||
    `${process.env.NODE_ENV ? process.env.NODE_ENV : 'DEV'}: Circles user profile service`
}

export {
  port,
  defaultAppMsg
}