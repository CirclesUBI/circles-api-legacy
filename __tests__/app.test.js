const request = require('supertest')
const app = require('../src/app')
const sns = require('../src/connections/sns');
const cognitoISP = require('../src/connections/cognito');
const { createFakeUser, createFakeOrganization, createFakeOffer, createFakeNotification } = require('../src/seeds/helpers/fakers');

const versionString = '/' + process.env.API_VERSION
let _dbUsers, _dbOrgs, _dbMembers, _dbOffers, _dbNotifs

class RandItems {
  constructor(items) {
      this.items = items
  }
  add(item) {
    this.items.push(item)
  }
  random() {
      return this.items[Math.floor(Math.random()*this.items.length)]
  }
}

sns.createSNSEndpoint = jest.fn()
sns.createSNSEndpoint.mockReturnValue(
  Promise.resolve("arn:aws:sns:eu-west-1:12345:endpoint/APNS_SANDBOX/blah-app/c08d3ccd-3e07-328c-a77d-20b2a790122f")
)

cognitoISP.addToCognitoGroup = jest.fn()
cognitoISP.addToCognitoGroup.mockReturnValue(
  Promise.resolve()
)

describe('Setup', () => {

  it('It has to mock sns', () => {            
    sns.createSNSEndpoint().then( res => {
      console.info('createSNSEndpoint', res)      
    })
    expect(sns.createSNSEndpoint).toHaveBeenCalled();
  })

  it('It has to mock cognito', () => {            
    cognitoISP.addToCognitoGroup().then( res => {
      console.info('cognitoISP', res)      
    })
    expect(cognitoISP.addToCognitoGroup).toHaveBeenCalled();
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

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _dbUsers = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /users/user_id on GET', async () => {
      const testUser = _dbUsers.random()    
      const { res, req } = await request(app)
        .get(versionString + '/users/' + testUser.id)      
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const user = JSON.parse(res.text)    
      expect(user.id).toEqual(testUser.id)
    });

    it('It should create a specific /users on POST', async () => {                 
      const testUser = createFakeUser()
      const { res, req } = await request(app)
        .post(versionString + '/users')
        .send(testUser)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const user = JSON.parse(res.text)
      expect(user.id).toEqual(testUser.id)      
    });

    it('It should update a specific /users/user_id on PUT', async () => {  
      const testUser = _dbUsers.random()    
      const email = 'user@test.com'    
      const { res, req } = await request(app)
        .put(versionString + '/users/' + testUser.id)
        .send({email: email})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const user = JSON.parse(res.text)
      expect(user.email).toEqual(email)
    });

    it('It should delete a specific /users/user_id on DELETE', async () => {  
      const testUser = _dbUsers.random()   
      const { res, req } = await request(app)
        .delete(versionString + '/users/' + testUser.id)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);     
    });
  })

  describe('Org API', () => {    

    it('It should return all /orgs on GET', async () => {
      const { res, req } = await request(app).get(versionString + '/orgs')      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _dbOrgs = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /orgs/user_id on GET', async () => {
      const testOrg = _dbOrgs.random()    
      const { res, req } = await request(app)
        .get(versionString + '/orgs/' + testOrg.id)      
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const org = JSON.parse(res.text)    
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should create a specific /orgs/ on POST', async () => {  
      const testOrg = createFakeOrganization()
      testOrg.owner_id = _dbUsers.random().id
      const { res, req } = await request(app)
        .post(versionString + '/orgs')
        .send(testOrg)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const org = JSON.parse(res.text)
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should update a specific /orgs/org_id on PUT', async () => {  
      const testOrg = _dbOrgs.random()  
      const email = 'org@test.com'    
      const { res, req } = await request(app)
        .put(versionString + '/orgs/' + testOrg.id)
        .send({email: email})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const org = JSON.parse(res.text)
      expect(org.email).toEqual(email)
    });

    it('Orgs should have members who exist', async () => {  
      const testOrg = _dbOrgs.random()
      let response = await request(app)
        .get(versionString + '/orgs/' + testOrg.id)
        .set('Accept', 'application/json')

      const orgRes = response.res 
      expect(orgRes.statusCode).toEqual(200);        
      const org = JSON.parse(orgRes.text)
      expect(org.members).toBeDefined()
      _dbMembers = new RandItems(org.members)
      
      const testMember = _dbMembers.random()
      response = await request(app)
        .get(versionString + '/users/' + testMember.id)
        .set('Accept', 'application/json')

      const userRes = response.res
      expect(userRes.statusCode).toEqual(200)
      const user = JSON.parse(userRes.text)
      expect(testMember.id).toEqual(user.id)      
    });

    it('It should delete a specific /orgs/org_id on DELETE', async () => {  
      const testOrg = _dbOrgs.random()   
      const { res, req } = await request(app)
        .delete(versionString + '/orgs/' + testOrg.id)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200); 
    });
  })

  describe('Notification API', () => {    

    it('It should return all /notifs on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/notifs')
        .set('Accept', 'application/json') 

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()
      _dbNotifs = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /notifs/{notification_id} on GET', async () => {
      const testNotif = _dbNotifs.random()
      const { res, req } = await request(app)
        .get(versionString + '/notifs/' + testNotif.id)      
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const notification = JSON.parse(res.text)    
      expect(notification.id).toEqual(testNotif.id)
    });

    it('It should create a specific /notifs/ on POST', async () => {  
      let testNotif = createFakeNotification()
      testNotif.id = Math.floor(100 + Math.random() * 10000)
      testNotif.user_id = _dbUsers.random().id
      const { res, req } = await request(app)
        .post(versionString + '/notifs')
        .send(testNotif)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const notification = JSON.parse(res.text)
      expect(notification.id).toEqual(testNotif.id)
    });

    it('It should update a specific /notifs/{notification_id} on PUT', async () => {  
      const testNotif = _dbNotifs.random()  
      const title = 'notif@test.com'
      const { res, req } = await request(app)
        .put(versionString + '/notifs/' + testNotif.id)
        .send({title: title})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const notification = JSON.parse(res.text)
      expect(notification.title).toEqual(title)
    });

    it('It should delete a specific /notifs/{notification_id} on DELETE', async () => {  
      const testNotif = _dbNotifs.random()  
      const { res, req } = await request(app)
        .delete(versionString + '/notifs/' + testNotif.id)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200); 
    });

  })
  
  describe('Offer API', () => {    

    it('It should return all /offers on GET', async () => {
      const { res, req } = await request(app)
        .get(versionString + '/offers')      
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()
      _dbOffers = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /offers/offer_id on GET', async () => {
      const testOffer = _dbOffers.random()
      const { res, req } = await request(app)
        .get(versionString + '/offers/' + testOffer.id)      
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const offer = JSON.parse(res.text)    
      expect(offer.id).toEqual(testOffer.id)
    });

    it('It should create a specific /offers/ on POST', async () => {  
      let testOffer = createFakeOffer()
      testOffer.id = Math.floor(100 + Math.random() * 10000)
      const { res, req } = await request(app)
        .post(versionString + '/offers')
        .send(testOffer)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const offer = JSON.parse(res.text)
      expect(offer.id).toEqual(testOffer.id)
    });

    it('It should update a specific /offers/offer_id on PUT', async () => {  
      const testOffer = _dbOffers.random()  
      const title = 'offer@test.com'
      const { res, req } = await request(app)
        .put(versionString + '/offers/' + testOffer.id)
        .send({title: title})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      const offer = JSON.parse(res.text)
      expect(offer.title).toEqual(title)
    });

    it('It should delete a specific /offers/offer_id on DELETE', async () => {  
      const testOffer = _dbOffers.random()  
      const { res, req } = await request(app)
        .delete(versionString + '/offers/' + testOffer.id)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200); 
    });
  })
})