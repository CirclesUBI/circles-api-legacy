const request = require('supertest')
const app = require('../src/app')
const sns = require('../src/connections/sns');
const cognito = require('../src/connections/cognito');
const { createFakeUser, createFakeCognitoUser, createFakeOrganization, createFakeOffer, createFakeNotification } = require('../src/seeds/helpers/fakers');

const versionString = '/' + process.env.API_VERSION

convertToObjectProperties = array => {
  let obj = {}
  array.map( keyval => {
    obj[keyval.Name] = keyval.Value
  })
  return obj
}

let testUser
let testCognitoUser
let testUserAccessToken
let testOrg
let testNotif
let testOffer

describe('Setup', () => {

  it('It has to create a new cognito testUser', async () => {            
    testUser = createFakeCognitoUser()
    testUser.phone_number_verified = true
    testUser.email_verified = true
    const attribs = Object.entries(testUser).map( pair => {
      return {"Name": pair[0], "Value": pair[1].toString()}
    })
  
    const createUserRequest = {
      "MessageAction": "SUPPRESS",
      "TemporaryPassword": "test_user_pass",
      "UserAttributes": attribs,
      "Username": testUser.phone_number,
      "UserPoolId": process.env.COGNITO_POOL_ID,
    }

    await cognito.createUser(createUserRequest).then( res => {
      expect(res.User).toBeDefined()
      expect(res.User.Enabled).toBeTruthy()      
    })
  })

  it('It has to log in as the new testUser', async () => {
    const authRequest = {
      "AuthFlow": "ADMIN_NO_SRP_AUTH",
      "AuthParameters": { 
         "USERNAME": testUser.phone_number,
         "PASSWORD": "test_user_pass",
      },
      "ClientId": process.env.COGNITO_CLIENT_ID,
      "UserPoolId": process.env.COGNITO_POOL_ID
    }

    await cognito.initAuth(authRequest).then( res => {
      expect(res.ChallengeName).toEqual("NEW_PASSWORD_REQUIRED")
      testUser.sessionToken = res.Session
    })
  })

  it('It has to set the testUser password', async () => {
    const authChallengeRequest = {
      "ChallengeName": "NEW_PASSWORD_REQUIRED",
      "ChallengeResponses": { 
         "NEW_PASSWORD" : "df84gorij05439j",
         "USERNAME": testUser.phone_number
      },
      "ClientId": process.env.COGNITO_CLIENT_ID,
      "Session": testUser.sessionToken,
      "UserPoolId": process.env.COGNITO_POOL_ID
    }

    await cognito.confirmAuth(authChallengeRequest).then( res => {
      expect(res.AuthenticationResult).toBeDefined()
      testUserAccessToken = res.AuthenticationResult.AccessToken
    })
  })

  it('It has to confirm the new user is set up correctly', async () => {
    const getUserRequest = {
      "Username": testUser.phone_number,
      "UserPoolId": process.env.COGNITO_POOL_ID
    }

    await cognito.getUser(getUserRequest).then( res => {      
      expect(res.Enabled).toBeTruthy()
      expect(res.UserStatus).toEqual("CONFIRMED")
      testCognitoUser = res
      testCognitoUser.UserAttributes = convertToObjectProperties(res.UserAttributes)
    })
  })
})
    
describe('Integration Tests', () => {

  it('It should respond to the base route on GET', async () => {
    const result = await request(app).get('/');
    expect(result.text).toEqual('"hello Ed!"');
    expect(result.statusCode).toEqual(200);
  });  

  describe('User API', () => {

    it('It should return all /users on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/users')      
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()
    });

    it('It should create a specific /users on POST', async () => {                 
      const { res, req } = await request(app)
        .post(versionString + '/users')
        .send(testCognitoUser.UserAttributes)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200)
      expect(res.text).toBeDefined()
      const user = JSON.parse(res.text)      
      expect(user.id).toEqual(testCognitoUser.UserAttributes.sub)
    });

    it('It should return a specific /users/user_id on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/users/' + testCognitoUser.UserAttributes.sub)      
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const user = JSON.parse(res.text)    
      expect(user.id).toEqual(testCognitoUser.UserAttributes.sub)
    });

    it('It should update a specific /users/user_id on PUT', async () => {  
      const email = 'user@test.com'
      const { res, req } = await request(app)
        .put(versionString + '/users/' + testCognitoUser.UserAttributes.sub)
        .send({email: email})
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const user = JSON.parse(res.text)
      expect(user.email).toEqual(email)
    });
  })

  describe('Org API', () => {    

    it('It should return all /orgs on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/orgs')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
    });

    it('It should create a specific /orgs/ on POST', async () => {  
      testOrg = createFakeOrganization()
      testOrg.owner_id = testCognitoUser.UserAttributes.sub
      testOrg.members = [testCognitoUser.UserAttributes.sub]
      const { res, req } = await request(app)
        .post(versionString + '/orgs')
        .send(testOrg)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const org = JSON.parse(res.text)
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should return a specific /orgs/org_id on GET', async () => { 
      const { res, req } = await request(app)
        .get(versionString + '/orgs/' + testOrg.id)      
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const org = JSON.parse(res.text)    
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should update a specific /orgs/org_id on PUT', async () => {   
      const email = 'org@test.com'    
      const { res, req } = await request(app)
        .put(versionString + '/orgs/' + testOrg.id)
        .send({email: email})
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const org = JSON.parse(res.text)
      expect(org.email).toEqual(email)
    });

    // it('Orgs should have members who exist', async () => {  
    //   let response = await request(app)
    //     .get(versionString + '/orgs/' + testOrg.id)
    //     .set('Accept', 'application/json')
    //     .set('accesstoken', testUserAccessToken)

    //   const orgRes = response.res 
    //   expect(orgRes.statusCode).toEqual(200);        
    //   const org = JSON.parse(orgRes.text)
    //   expect(org.members).toBeDefined()
    //   const testMember = org.members[0]
    //   console.log(testMember)
      
    //   response = await request(app)
    //     .get(versionString + '/users/' + testMember.id)
    //     .set('Accept', 'application/json')         
    //     .set('accesstoken', testUserAccessToken)

    //   const userRes = response.res
    //   expect(userRes.statusCode).toEqual(200)
    //   const user = JSON.parse(userRes.text)
    //   expect(testMember.id).toEqual(user.id)      
    // });

    it('It should delete a specific /orgs/org_id on DELETE', async () => {  
      const { res, req } = await request(app)
        .delete(versionString + '/orgs/' + testOrg.id)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200); 
    })
  })

  describe('Notification API', () => {    

    it('It should return all /notifs on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/notifs')
        .set('Accept', 'application/json') 
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()
    });

    it('It should create a specific /notifs/ on POST', async () => {  
      testNotif = createFakeNotification()
      testNotif.id = Math.floor(100 + Math.random() * 10000)
      testNotif.user_id = testCognitoUser.UserAttributes.sub
      const { res, req } = await request(app)
        .post(versionString + '/notifs')
        .send(testNotif)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const notification = JSON.parse(res.text)
      expect(notification.id).toEqual(testNotif.id)
    });

    it('It should return a specific /notifs/{notification_id} on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/notifs/' + testNotif.id)      
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const notification = JSON.parse(res.text)    
      expect(notification.id).toEqual(testNotif.id)
    });


    it('It should update a specific /notifs/{notification_id} on PUT', async () => {  
      const title = 'notif@test.com'
      const { res, req } = await request(app)
        .put(versionString + '/notifs/' + testNotif.id)
        .send({title: title})
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const notification = JSON.parse(res.text)
      expect(notification.title).toEqual(title)
    });

    it('It should delete a specific /notifs/{notification_id} on DELETE', async () => {  
      const { res, req } = await request(app)
        .delete(versionString + '/notifs/' + testNotif.id)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200); 
    });
  })
  
  describe('Offer API', () => {    

    it('It should return all /offers on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/offers')      
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()
    });

    it('It should create a specific /offers/ on POST', async () => {
      testOffer = createFakeOffer()        
      testOffer.id = Math.floor(100 + Math.random() * 10000)
      const { res, req } = await request(app)
        .post(versionString + '/offers')
        .send(testOffer)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const offer = JSON.parse(res.text)
      expect(offer.id).toEqual(testOffer.id)
    });

    it('It should return a specific /offers/offer_id on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/offers/' + testOffer.id)      
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const offer = JSON.parse(res.text)    
      expect(offer.id).toEqual(testOffer.id)
    });

    it('It should update a specific /offers/offer_id on PUT', async () => {  
      const title = 'offer@test.com'
      const { res, req } = await request(app)
        .put(versionString + '/offers/' + testOffer.id)
        .send({title: title})
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const offer = JSON.parse(res.text)
      expect(offer.title).toEqual(title)
    });

    it('It should delete a specific /offers/offer_id on DELETE', async () => {  
      const { res, req } = await request(app)
        .delete(versionString + '/offers/' + testOffer.id)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200); 
    });
  })
  
  describe('Teardown', () => {

    it('It should delete a specific /users/user_id on DELETE', async () => {   
      const { res, req } = await request(app)
        .delete(versionString + '/users/' + testCognitoUser.UserAttributes.sub)
        .set('Accept', 'application/json')
        .set('accesstoken', testUserAccessToken)

      expect(res.statusCode).toEqual(200);     
    });    
  })  
})
