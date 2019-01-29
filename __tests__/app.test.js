
const fs = require('fs')
const request = require('supertest')
const app = require('../src/app')
const sns = require('../src/connections/sns');

// const AWS = require('aws-sdk-mock');

const _testStubDB = require('./stubs/db.json')

const versionString = '/' + process.env.API_VERSION

let _dbUsers, _dbOrgs, _dbMembers

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

// Mocks
// AWS.mock('SNS', 'createPlatformEndpoint', (params, callback) => {
//   console.log('MOCKMOCKMOCKMOCKMOCKMOCKMOCKMOCK!')
//   callback(null, "successfully");
// });

// AWS.mock('sns', 'createPlatformEndpoint', (params, callback) => {
//   console.log('MOCKMOCKMOCKMOCKMOCKMOCKMOCKMOCK!')
//   callback(null, "successfully");
// });

// jest.mock('aws-sdk', () => {
//   const mocks = {
//     createPlatformEndpointMock: jest.fn((value) => ({
//       ResponseMetadata:{RequestId:"efdb1199-f10e-5b0b-bff9-43addbda438b"},
//       EndpointArn:"arn:aws:sns:eu-west-1:12345:endpoint/APNS_SANDBOX/blah-app/c08d3ccd-3e07-328c-a77d-20b2a790122f"      
//     }))
//   }

//   const SNS = {
//     createPlatformEndpoint: (obj) => ({
//       promise: () => {
//         console.log('HERHEHREHREHREHE')
//         mocks.createPlatformEndpointMock(obj)
//       }
//     })
//   }
//   return {
//     mocks,
//     SNS: jest.fn().mockImplementation(() => SNS)
//   }
// })

// {
//   ResponseMetadata:{RequestId:"efdb1199-f10e-5b0b-bff9-43addbda438b"},
//   EndpointArn:"arn:aws:sns:eu-west-1:12345:endpoint/APNS_SANDBOX/blah-app/c08d3ccd-3e07-328c-a77d-20b2a790122f"
// }

sns.createSNSEndpoint = jest.fn()
sns.createSNSEndpoint.mockReturnValue(
  Promise.resolve("arn:aws:sns:eu-west-1:12345:endpoint/APNS_SANDBOX/blah-app/c08d3ccd-3e07-328c-a77d-20b2a790122f")
)

// jest.mock('createSNSEndpoint', () => {
//   return Promise.resolve({
//     ResponseMetadata:{RequestId:"efdb1199-f10e-5b0b-bff9-43addbda438b"},
//     EndpointArn:"arn:aws:sns:eu-west-1:12345:endpoint/APNS_SANDBOX/blah-app/c08d3ccd-3e07-328c-a77d-20b2a790122f"
//   })
// })

// AWS.mock('SNS', 'createPlatformEndpoint', function (){
//   console.log('herherherherh')
//   // mockedCreatePlatformEndpoint()
//   callback(null, "successfully put item in database");
// });



describe('Setup', () => {

  it('It has to mock sns', () => {    
        
    sns.createSNSEndpoint().then( res => {
      console.info('createSNSEndpoint', res)      
    })
    expect(sns.createSNSEndpoint).toHaveBeenCalled();
  })
})
    
describe('Integration Tests', () => {

  it('It should respond to the base route on GET', async () => {
    const result = await request(app).get('/');
    expect(result.text).toEqual('"hello Ed!"');
    expect(result.statusCode).toEqual(200);
  });  

  describe('User API', () => {

    // beforeAll(()=>{
    //   AWS.SNS = jest.fn().mockImplementation( ()=> {
    //     return {
    //       putObject (params, cb) {
    //         result = cb();
    //       }
    //     };
    //   });
    //   require('../index');
    // });

    it('It should return all /users on GET', async () => {
      const { res, req } = await request(app).get(versionString + '/users')      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _dbUsers = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /users/userId on GET', async () => {
      let testUser = _dbUsers.random()    
      const { res, req } = await request(app).get(versionString + '/users/' + testUser.id)      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let user = JSON.parse(res.text)    
      expect(user.id).toEqual(testUser.id)
    });

    it('It should create a specific /users on POST', async (done) => {                 
      let testUser = new RandItems(_testStubDB.user).random()
      // _dbUsers.add(testUser)
      const { res, req } = await request(app)
        .post(versionString + '/users')
        .send(testUser)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let user = JSON.parse(res.text)
      expect(user.email).toEqual(email)      
      done()
    });

    it('It should update a specific /users/userId on PUT', async () => {  
      let testUser = _dbUsers.random()    
      let email = 'user@test.com'    
      const { res, req } = await request(app)
        .put(versionString + '/users/' + testUser.id)
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

    it('It should return all /orgs on GET', async () => {
      const { res, req } = await request(app).get(versionString + '/orgs')      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      _dbOrgs = new RandItems(JSON.parse(res.text))
    });

    it('It should return a specific /orgs/userId on GET', async () => {
      let testOrg = _dbOrgs.random()    
      const { res, req } = await request(app).get(versionString + '/orgs/' + testOrg.id)      
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let org = JSON.parse(res.text)    
      expect(org.id).toEqual(testOrg.id)
    });

    it('It should create a specific /orgs/ on POST', async () => {  
      let testOrg = new RandItems(_testStubDB.organization).random()
      console.log(testOrg)
      _dbOrgs.add(testOrg)
      const { res, req } = await request(app)
        .post(versionString + '/orgs')
        .send(testOrg)
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let org = JSON.parse(res.text)
      expect(org.email).toEqual(email)
    });

    it('It should update a specific /orgs/orgId on PUT', async () => {  
      let testOrg = _dbOrgs.random()  
      let email = 'org@test.com'    
      const { res, req } = await request(app)
        .put(versionString + '/orgs/' + testOrg.id)
        .send({email: email})
        .set('Accept', 'application/json')

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined()    
      let org = JSON.parse(res.text)
      expect(org.email).toEqual(email)
    });

    it('Orgs should have members who exist', async () => {  
      let testOrg = _dbOrgs.random()
      let response = await request(app).get(versionString + '/orgs/' + testOrg.id)
      const orgRes = response.res 
      expect(orgRes.statusCode).toEqual(200);        
      let org = JSON.parse(orgRes.text)
      expect(org.members).toBeDefined()
      _dbMembers = new RandItems(org.members)
      
      let testMember = _dbMembers.random()      
      response = await request(app).get(versionString + '/users/' + testMember.id)
      const userRes = response.res
      expect(userRes.statusCode).toEqual(200);        
      let user = JSON.parse(userRes.text)
      expect(testMember.id).toEqual(user.id)      
    });

    // todo: destoy orgs record
  })
  
})