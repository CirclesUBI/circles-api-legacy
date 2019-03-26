const convertCognitoToCirclesUser = cognitoUser => {
  return {
    agreed_to_disclaimer: false,
    username: cognitoUser.username,
    id: cognitoUser.sub,
    device_id: cognitoUser['custom:device_id'],
    email: cognitoUser.email,
    display_name: cognitoUser.name,
    phone_number: cognitoUser.phone_number,
    profile_pic_url: cognitoUser.picture,
    token_address: cognitoUser.token_address,
    wallet_address: cognitoUser.wallet_address
  }
}

module.exports = convertCognitoToCirclesUser
