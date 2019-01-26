const request = require('supertest')
const app = require('../src/app')
const AWS = require('aws-sdk-mock')

const versionString = '/' + process.env.API_VERSION

var _test = {
  users: [],
  orgs: [],
  members: [],
  randomUser: () => {
    return _test.users[Math.floor(Math.random()*_test.users.length)]
  },
  randomOrg: () => {
    return _test.orgs[Math.floor(Math.random()*_test.orgs.length)]
  },
  randomMember: () => {
    return _test.members[Math.floor(Math.random()*_test.members.length)]
  }

}
    
describe('Integration Tests', () => {

  it('It should respond to the base route', async () => {
    const result = await request(app).get('/');
    expect(result.text).toEqual('"hello Ed!"');
    expect(result.statusCode).toEqual(200);
  });  

  describe('User API', () => {

    it('It should return all /users', async () => {
      const { res, req } = await request(app).get(versionString + '/users')      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _test.users = JSON.parse(res.text)
    });

    it('It should return a specific /users/userId', async () => {
      let testUser = _test.randomUser()    
      const { res, req } = await request(app).get(versionString + '/users/' + testUser.id)      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let user = JSON.parse(res.text)    
      expect(user.id).toEqual(testUser.id)
    });

    it('It should update a specific /users/userId', async () => {  
      let testUser = _test.randomUser()    
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
      _test.orgs = JSON.parse(res.text)
    });

    it('It should return a specific /orgs/userId', async () => {
      let testOrg = _test.randomOrg()    
      const { res, req } = await request(app).get(versionString + '/orgs/' + testOrg.id)      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let org = JSON.parse(res.text)    
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should update a specific /orgs/orgId', async () => {  
      let testOrg = _test.randomOrg()    
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
      let testOrg = _test.randomOrg() 
      let response = await request(app).get(versionString + '/orgs/' + testOrg.id)
      const orgRes = response.res 
      expect(orgRes.statusCode).toEqual(200);        
      let org = JSON.parse(orgRes.text)
      expect(org.members).toBeDefined()
      _test.members = org.members      
      
      let testMember = _test.randomMember()      
      response = await request(app).get(versionString + '/users/' + testMember.id)
      const userRes = response.res
      expect(userRes.statusCode).toEqual(200);        
      let user = JSON.parse(userRes.text)
      expect(testMember.id).toEqual(user.id)      
    });

    // todo: destoy orgs record
  })
  
})