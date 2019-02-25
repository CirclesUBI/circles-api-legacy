const faker = require('faker')
const request = require('supertest')
const app = require('../src/app')
const server = require('../src/app').server
const cognito = require('../src/connections/cognito')

const {
  createFakeCognitoUser,
  createFakeOrganization,
  createFakeOffer,
  createFakeNotification
} = require('../src/seeds/helpers/fakers')

const versionString = '/v' + process.env.npm_package_version
const adminVersionString = versionString + '/admin'

convertToObjectProperties = array => {
  let obj = {}
  array.map(keyval => {
    obj[keyval.Name] = keyval.Value
  })
  return obj
}

let testUser
let testCognitoUser
let adminCognitoUser
let testUserAccessToken
let adminUserAccessToken
let testAdminOrg
let testUserOrg
let testNotif
let testOffer
let testOwnedOffer
let testOtherOffer

describe('Setup', () => {
  it('It has to create a new testCognitoUser', async () => {
    testUser = createFakeCognitoUser()
    testUser.phone_number_verified = true
    testUser.email_verified = true
    const attribs = Object.entries(testUser).map(pair => {
      return { Name: pair[0], Value: pair[1].toString() }
    })

    const createUserRequest = {
      MessageAction: 'SUPPRESS',
      TemporaryPassword: 'test_user_pass',
      UserAttributes: attribs,
      Username: testUser.phone_number,
      UserPoolId: process.env.COGNITO_POOL_ID
    }

    await cognito.createUser(createUserRequest).then(res => {
      expect(res.User).toBeDefined()
      expect(res.User.Enabled).toBeTruthy()
    })
  })

  it('It has to log in as the new testCognitoUser', async () => {
    const authRequest = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: testUser.phone_number,
        PASSWORD: 'test_user_pass'
      },
      ClientId: process.env.COGNITO_CLIENT_ID_API,
      UserPoolId: process.env.COGNITO_POOL_ID
    }

    await cognito.initAuth(authRequest).then(res => {
      expect(res.ChallengeName).toEqual('NEW_PASSWORD_REQUIRED')
      testUser.sessionToken = res.Session
    })
  })

  it('It has to set the new testCognitoUser password', async () => {
    const authChallengeRequest = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: 'df84gorij05439j',
        USERNAME: testUser.phone_number
      },
      ClientId: process.env.COGNITO_CLIENT_ID_API,
      Session: testUser.sessionToken,
      UserPoolId: process.env.COGNITO_POOL_ID
    }

    await cognito.confirmAuth(authChallengeRequest).then(res => {
      expect(res.AuthenticationResult).toBeDefined()
      testUserAccessToken = res.AuthenticationResult.AccessToken
    })
  })

  it('It has to confirm the new testCognitoUser is set up correctly', async () => {
    const getUserRequest = {
      Username: testUser.phone_number,
      UserPoolId: process.env.COGNITO_POOL_ID
    }

    await cognito.getUser(getUserRequest).then(res => {
      expect(res.Enabled).toBeTruthy()
      expect(res.UserStatus).toEqual('CONFIRMED')
      testCognitoUser = res
      testCognitoUser.UserAttributes = convertToObjectProperties(
        res.UserAttributes
      )
      testCognitoUser.UserAttributes.id = testCognitoUser.Username
    })
  })

  it('It has to log in as the adminCognitoUser', async () => {
    const authRequest = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: process.env.COGNITO_TEST_USERNAME,
        PASSWORD: process.env.COGNITO_TEST_PASSWORD
      },
      ClientId: process.env.COGNITO_CLIENT_ID_API,
      UserPoolId: process.env.COGNITO_POOL_ID
    }

    await cognito.initAuth(authRequest).then(res => {
      expect(res.AuthenticationResult.AccessToken).toBeDefined()
      adminUserAccessToken = res.AuthenticationResult.AccessToken
    })
  })

  it('It has to get the adminCognitoUser', async () => {
    const getUserRequest = {
      Username: process.env.COGNITO_TEST_USERNAME,
      UserPoolId: process.env.COGNITO_POOL_ID
    }

    await cognito.getUser(getUserRequest).then(res => {
      expect(res.Enabled).toBeTruthy()
      expect(res.UserStatus).toEqual('CONFIRMED')
      adminCognitoUser = res
      adminCognitoUser.UserAttributes = convertToObjectProperties(
        res.UserAttributes
      )
      adminCognitoUser.UserAttributes['custom:device_id'] = 'test_device_id'
      adminCognitoUser.UserAttributes.id = adminCognitoUser.Username
    })
  })
})

describe(
  'Integration Tests: Circles API ' + adminVersionString + ' admin routes',
  () => {
    it('It should respond to the base route on GET', async () => {
      const result = await request(app).get('/')
      expect(result.text).toEqual('"hello Ed!"')
      expect(result.statusCode).toEqual(200)
    })

    describe('User API', () => {
      it('First it should create a specific /users on POST', async () => {
        const { res, req } = await request(app)
          .post(adminVersionString + '/users')
          .send(adminCognitoUser.UserAttributes)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const user = JSON.parse(res.text)
        expect(user.id).toEqual(adminCognitoUser.Username)
      })

      it('It should return all /users on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/users')
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
      })

      it('It should return a specific /users/{user_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/users/' + adminCognitoUser.Username)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const user = JSON.parse(res.text)
        expect(user.id).toEqual(adminCognitoUser.Username)
      })

      it('It should update a specific /users/{user_id} on PUT', async () => {
        const email = 'user@test.com'
        const { res, req } = await request(app)
          .put(adminVersionString + '/users/' + adminCognitoUser.Username)
          .send({ email: email })
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const user = JSON.parse(res.text)
        expect(user.email).toEqual(email)
      })
    })

    describe('Org API', () => {
      it('It should create a specific /orgs/ on POST', async () => {
        testAdminOrg = createFakeOrganization()
        testAdminOrg.owner_id = adminCognitoUser.Username
        // testAdminOrg.members = [adminCognitoUser.Username]
        const { res, req } = await request(app)
          .post(adminVersionString + '/orgs')
          .send(testAdminOrg)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.id).toEqual(testAdminOrg.id)
      })

      it('It should return all /orgs on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/orgs')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
      })

      it('It should return a specific /orgs/{org_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/orgs/' + testAdminOrg.id)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.id).toEqual(testAdminOrg.id)
      })

      it('It should update a specific /orgs/{org_id} on PUT', async () => {
        const email = 'org@test.com'
        const { res, req } = await request(app)
          .put(adminVersionString + '/orgs/' + testAdminOrg.id)
          .send({ email: email })
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.email).toEqual(email)
      })

      it('It should delete a specific /orgs/{org_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(adminVersionString + '/orgs/' + testAdminOrg.id)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })
    })

    describe('Notification API', () => {
      it('It should create a specific /notifs/ on POST', async () => {
        testNotif = createFakeNotification()
        testNotif.owner_id = adminCognitoUser.Username
        const { res, req } = await request(app)
          .post(adminVersionString + '/notifs')
          .send(testNotif)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const notification = JSON.parse(res.text)
        expect(notification.description).toEqual(testNotif.description)
        expect(testNotif.id).toEqual(notification.id)
      })

      it('It should return all /notifs on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/notifs')
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
      })

      it('It should return a specific /notifs/{notification_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/notifs/' + testNotif.id)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const notification = JSON.parse(res.text)
        expect(notification.description).toEqual(testNotif.description)
      })

      it('It should update a specific /notifs/{notification_id} on PUT', async () => {
        const description = 'notif@test.com'
        const { res, req } = await request(app)
          .put(adminVersionString + '/notifs/' + testNotif.id)
          .send({ description: description })
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const notification = JSON.parse(res.text)
        expect(notification.description).toEqual(description)
      })

      it('It should delete a specific /notifs/{notification_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(adminVersionString + '/notifs/' + testNotif.id)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })
    })

    describe('Offer API', () => {
      it('It should create a specific /offers/ on POST', async () => {
        testOffer = createFakeOffer()
        testOffer.owner_id = adminCognitoUser.Username
        const { res, req } = await request(app)
          .post(adminVersionString + '/offers')
          .send(testOffer)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(testOffer.title)
        expect(testOffer.id).toEqual(offer.id)
      })

      it('It should return all /offers on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/offers')
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
      })

      it('It should return a specific /offers/{offer_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(adminVersionString + '/offers/' + testOffer.id)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(testOffer.title)
      })

      it('It should update a specific /offers/{offer_id} on PUT', async () => {
        const title = 'offer@test.com'
        const { res, req } = await request(app)
          .put(adminVersionString + '/offers/' + testOffer.id)
          .send({ title: title })
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(title)
      })

      it('It should delete a specific /offers/{offer_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(adminVersionString + '/offers/' + testOffer.id)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })
    })

    describe('Relayer API', () => {
      it('It should call a specific contract on POST', async () => {
        // const spyFn = jest.spyOn(HubContract, signup)
        const { res, req } = await request(app)
          .post(adminVersionString + '/relayer/signup')
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
        // expect(spyFn).toHaveBeenCalled()
      })

      it('It should error if non-existant contract called on POST', async () => {
        const { res, req } = await request(app)
          .post(adminVersionString + '/relayer/banana')
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(500)
      })
    })

    describe('Teardown', () => {
      it('It should delete a specific /users/{user_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(adminVersionString + '/users/' + adminCognitoUser.Username)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })
    })

    afterAll(async () => {
      try {
        console.log('Closing server ...')
        await server.close()
      } catch (error) {
        console.error(error)
        throw error
      }
    })
  }
)

describe(
  'Integration Tests: Circles API ' + versionString + ' user permissions',
  () => {
    it('It should respond to the base route on GET', async () => {
      const result = await request(app).get('/')
      expect(result.text).toEqual('"hello Ed!"')
      expect(result.statusCode).toEqual(200)
    })

    describe('User API', () => {
      it('First it should create its own /users on POST', async () => {
        const { res, req } = await request(app)
          .post(versionString + '/users')
          .send(testCognitoUser.UserAttributes)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const user = JSON.parse(res.text)
        expect(user.id).toEqual(testCognitoUser.Username)
      })

      it('It should then get a new token with groups included', async () => {
        const authRequest = {
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          AuthParameters: {
            USERNAME: testCognitoUser.Username,
            PASSWORD: 'df84gorij05439j'
          },
          ClientId: process.env.COGNITO_CLIENT_ID_API,
          UserPoolId: process.env.COGNITO_POOL_ID
        }

        await cognito.initAuth(authRequest).then(res => {
          expect(res.AuthenticationResult).toBeDefined()
          testUserAccessToken = res.AuthenticationResult.AccessToken
        })
      })

      it('It should be able to get its own /users on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/users')
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const user = JSON.parse(res.text)
        expect(user.id).toEqual(testCognitoUser.Username)
      })

      it('It should update its own /users on PUT', async () => {
        const email = 'user@test.com'
        const { res, req } = await request(app)
          .put(versionString + '/users')
          .send({ email: email })
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const user = JSON.parse(res.text)
        expect(user.email).toEqual(email)
      })
    })

    describe('Org API', () => {
      it('It should create its own /orgs/ on POST', async () => {
        testUserOrg = createFakeOrganization()
        testUserOrg.owner_id = testCognitoUser.Username
        const { res, req } = await request(app)
          .post(versionString + '/orgs')
          .send(testUserOrg)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.id).toEqual(testUserOrg.id)
      })

      it('It should create a second /orgs/ on POST', async () => {
        let secondOrg = createFakeOrganization()
        secondOrg.owner_id = testCognitoUser.Username
        const { res, req } = await request(app)
          .post(versionString + '/orgs')
          .send(secondOrg)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.id).toEqual(secondOrg.id)
      })

      it('It should return its own /orgs on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/orgs/')
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const orgs = JSON.parse(res.text)
        for (let i = 0; i < orgs.length; i++) {
          const org = orgs[i]
          expect(org.owner_id).toEqual(testCognitoUser.Username)
        }
      })

      it('It should return a specific owned /orgs/{organization_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/orgs/' + testUserOrg.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.id).toEqual(testUserOrg.id)
        expect(org.owner_id).toEqual(testCognitoUser.Username)
      })

      it('It should update its own /orgs/{organization_id} on PUT', async () => {
        const email = 'org@test.com'
        const { res, req } = await request(app)
          .put(versionString + '/orgs/' + testUserOrg.id)
          .send({ email: email })
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const org = JSON.parse(res.text)
        expect(org.email).toEqual(email)
      })

      it('It should delete its own /orgs/{organization_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(versionString + '/orgs/' + testUserOrg.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })
    })

    describe('Notification API', () => {
      it('First it should add a /notifs on POST with adminUser', async () => {
        testNotif = createFakeNotification()
        testNotif.owner_id = testCognitoUser.Username
        const { res, req } = await request(app)
          .post(adminVersionString + '/notifs')
          .send(testNotif)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const notification = JSON.parse(res.text)
        expect(notification.description).toEqual(testNotif.description)
        expect(notification.owner_id).toEqual(testCognitoUser.Username)
        testNotif.id = notification.id
      })

      it('... and a second /notifs on POST with adminUser', async () => {
        let secondNotif = createFakeNotification()
        secondNotif.owner_id = testCognitoUser.Username
        const { res, req } = await request(app)
          .post(adminVersionString + '/notifs')
          .send(secondNotif)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const notification = JSON.parse(res.text)
        expect(notification.owner_id).toEqual(testCognitoUser.Username)
      })

      it('It should return its own /notifs on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/notifs')
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const notifications = JSON.parse(res.text)
        for (let i = 0; i < notifications.length; i++) {
          const notif = notifications[i]
          expect(notif.owner_id).toEqual(testCognitoUser.Username)
          if (notif.id === testNotif.id)
            expect(notif.description).toEqual(testNotif.description)
        }
      })

      it('It should update its own /notifs on PUT', async () => {
        const description = 'notif@test.com'
        const { res, req } = await request(app)
          .put(versionString + '/notifs/' + testNotif.id)
          .send({ description: description })
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const notification = JSON.parse(res.text)
        expect(notification.description).toEqual(description)
      })

      it('It should not be able to update other /notifs/{notification_id} on PUT', async () => {
        const notif = createFakeNotification()
        const { res, req } = await request(app)
          .put(versionString + '/notifs/' + notif.id)
          .send({ description: notif.description })
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(404)
      })

      it('It should delete its own /notifs/{notification_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(versionString + '/notifs/' + testNotif.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })

      it('It should not be able to delete other /notifs/{notification_id} on DELETE', async () => {
        const notifId = createFakeNotification().id
        const { res, req } = await request(app)
          .delete(versionString + '/notifs/' + notifId)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(404)
      })
    })

    describe('Offer API', () => {
      it('First it should add an /offers/ on POST with adminUser', async () => {
        testOtherOffer = createFakeOffer()
        testOtherOffer.owner_id = faker.random.uuid()
        const { res, req } = await request(app)
          .post(adminVersionString + '/offers')
          .send(testOtherOffer)
          .set('Accept', 'application/json')
          .set('accesstoken', adminUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(testOtherOffer.title)
        testOtherOffer.id = offer.id
      })

      it('It should return all /offers on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/offers')
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
      })

      it('It should create its own /offers/ on POST', async () => {
        testOwnedOffer = createFakeOffer()
        testOwnedOffer.owner_id = testCognitoUser.Username
        const { res, req } = await request(app)
          .post(versionString + '/offers')
          .send(testOwnedOffer)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(201)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(testOwnedOffer.title)
        testOwnedOffer.id = offer.id
      })

      it('It should return its own /offers/{offer_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/offers/' + testOwnedOffer.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(testOwnedOffer.title)
        expect(offer.owner_id).toEqual(testCognitoUser.Username)
      })

      it('It should be able to return other /offers/{offer_id} on GET', async () => {
        const { res, req } = await request(app)
          .get(versionString + '/offers/' + testOtherOffer.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(testOtherOffer.title)
      })

      it('It should update its own /offers/{offer_id} on PUT', async () => {
        const title = 'offer@test.com'
        const { res, req } = await request(app)
          .put(versionString + '/offers/' + testOwnedOffer.id)
          .send({ title: title })
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
        expect(res.text).toBeDefined()
        const offer = JSON.parse(res.text)
        expect(offer.title).toEqual(title)
      })

      it('It should not be able to update other /offers/{offer_id} on PUT', async () => {
        const title = 'offer@test.com'
        const { res, req } = await request(app)
          .put(versionString + '/offers/' + testOtherOffer.id)
          .send({ title: title })
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(403)
      })

      it('It should delete its own /offers/{offer_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(versionString + '/offers/' + testOwnedOffer.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })

      it('It should not be able to delete other /offers/{offer_id} on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(versionString + '/offers/' + testOtherOffer.id)
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(403)
      })
    })

    describe('Teardown', () => {
      it('It should delete its own /users on DELETE', async () => {
        const { res, req } = await request(app)
          .delete(versionString + '/users')
          .set('Accept', 'application/json')
          .set('accesstoken', testUserAccessToken)

        expect(res.statusCode).toEqual(200)
      })

      it('It should delete the testCognitoUser', async () => {
        const deleteUserRequest = {
          Username: testUser.phone_number,
          UserPoolId: process.env.COGNITO_POOL_ID
        }

        await cognito.deleteUser(deleteUserRequest)
      })
    })

    afterAll(async () => {
      try {
        console.log('Closing server ...')
        await server.close()
      } catch (error) {
        console.error(error)
        throw error
      }
    })
  }
)
