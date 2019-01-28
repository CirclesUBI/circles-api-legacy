const request = require('supertest')
const app = require('../src/app')
const AWS = require('aws-sdk-mock')

const versionString = '/' + process.env.API_VERSION

let _testUsers, _testOrgs, _testMembers

class RandItems {
  constructor(items) {
      this.items = items
  }
  random() {
      return this.items[Math.floor(Math.random()*this.items.length)]
  }
}
    
describe('Integration Tests', () => {

  it('It should respond to the base route', async () => {
    const result = await request(app).get('/');
    expect(result.text).toEqual('"hello Ed!"');
    expect(result.statusCode).toEqual(200);
  });  

  describe('User API', () => {

    it('It should return all /users on GET', async () => {
      const { res, req } = await request(app).get(versionString + '/users')      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _testUsers = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /users/userId on GET', async () => {
      let testUser = _testUsers.random()    
      const { res, req } = await request(app).get(versionString + '/users/' + testUser.id)      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let user = JSON.parse(res.text)    
      expect(user.id).toEqual(testUser.id)
    });

    it('It should create a specific /users on POST', async () => {  
      let testUser = _testUsers.random()      
      let email = 'user@test.com'    
      const { res, req } = await request(app)
        .post(versionString + '/users/' + testUser.id)
        .send({email: email})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let user = JSON.parse(res.text)
      expect(user.email).toEqual(email)
    });

    it('It should update a specific /users/userId on PUT', async () => {  
      let testUser = _testUsers.random()    
      let email = 'user@test.com'    
      const { res, req } = await request(app)
        .post(versionString + '/users/' + testUser.id)
        .send({email: email})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let user = JSON.parse(res.text)
      expect(user.email).toEqual(email)
    });

    // todo: destoy user record
  })

  describe('Org API', () => {    

    it('It should return all /orgs', async () => {
      const { res, req } = await request(app).get(versionString + '/orgs')      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _testOrgs = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /orgs/userId', async () => {
      let testOrg = _testOrgs.random()    
      const { res, req } = await request(app).get(versionString + '/orgs/' + testOrg.id)      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let org = JSON.parse(res.text)    
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should update a specific /orgs/orgId', async () => {  
      let testOrg = _testOrgs.random()  
      let email = 'org@test.com'    
      const { res, req } = await request(app)
        .post(versionString + '/orgs/' + testOrg.id)
        .send({email: email})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let org = JSON.parse(res.text)
      expect(org.email).toEqual(email)
    });

    it('Orgs should have members who exist', async () => {  
      let testOrg = _testOrgs.random()
      let response = await request(app).get(versionString + '/orgs/' + testOrg.id)
      const orgRes = response.res 
      expect(orgRes.statusCode).toEqual(200);        
      let org = JSON.parse(orgRes.text)
      expect(org.members).toBeDefined()
      _testMembers = new RandItems(org.members)
      
      let testMember = _testMembers.random()      
      response = await request(app).get(versionString + '/users/' + testMember.id)
      const userRes = response.res
      expect(userRes.statusCode).toEqual(200);        
      let user = JSON.parse(userRes.text)
      expect(testMember.id).toEqual(user.id)      
    });

    // todo: destoy orgs record
  })
  
})