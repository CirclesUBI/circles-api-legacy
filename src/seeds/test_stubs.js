const fs = require('fs');
const path = require('path');
const { createFakeUser, createFakeOrganization, createFakeOffer, createFakeNotification } = require('./helpers/fakers')

const testStubFolder = '/../../__tests__/stubs'

const fakeUsers = []
const requiredUsers = 5

const fakeOrganizations = []
const requiredOrganizations = 2

let fakeUserOrgs = []

const fakeNotifications = []
const notificationsPerUser = 3

let fakeOffers = []
const offersPerUser = 1
const offersPerOrg = 3
let offerIndex = 0 
const offerTypes = ['ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY']

let jsonDB = {}

function writeJsonStub(json) {
  return new Promise( (resolve, reject) => {
    let file = JSON.stringify(json)
    fs.writeFile(__dirname + testStubFolder+'/db.json', file, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        reject(err);
      }
      console.log("Test stub file has been saved to "+testStubFolder+"/db.json");
      resolve()
    });
  })
}

function deleteStubs() {
  return new Promise( (resolve, reject) => {
    let directory = __dirname + testStubFolder
    fs.readdir(directory, (err, files) => {
      if (err) reject(err);
    
      for (const file of files) {
        console.log('deleting stub: '+file)
        fs.unlink(path.join(directory, file), err => {
          if (err) reject(err);
        });
      }
      resolve()
    });
  })
}

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    deleteStubs()
  ]).then(() => {
    for (let i = 0; i < requiredUsers; i++) {
      const u = createFakeUser()
      // saving enough userIds so I can associate each
      // org with a user in the 'user_organizations' join table
      if (i < requiredOrganizations) {
        fakeUserOrgs.push({user_id: u.id})
      }
      fakeUsers.push(u)
    }
    jsonDB.user = fakeUsers
  })
  .then(() => {
    for (let i = 0; i < requiredOrganizations; i++) {
      const o = createFakeOrganization()
      o.owner_id = fakeUsers[i].id
      fakeUserOrgs[i].organization_id = o.id
      fakeOrganizations.push(o)
    }
    jsonDB.organization = fakeOrganizations
  })
  .then(() => {
    jsonDB.user_organizations = fakeUserOrgs
  })
  .then(() => {
    for (let i = 0; i < fakeUsers.length; i++) {
      for (let j = 0; j < notificationsPerUser; j++) {
        const n = createFakeNotification()
        n.user_id = fakeUsers[i].id
        fakeNotifications.push(n)
      }
    }
    jsonDB.notification = fakeNotifications
  })
  .then(() => {
    for (let i = 0; i < fakeUsers.length; i++) {
      for (let j = 0; j < offersPerUser; j++) {     
        const type = offerTypes[Math.floor(Math.random()*offerTypes.length)]
        const o = createFakeOffer(offerIndex++, type)
        o.owner_id = fakeUsers[i].id
        fakeOffers.push(o)
      }
    }
    jsonDB.offer = fakeOffers
  })
  .then(() => {
    fakeOffers = []
    for (let i = 0; i < fakeOrganizations.length; i++) {
      for (let j = 0; j < offersPerOrg; j++) {
        const type = offerTypes[Math.floor(Math.random()*offerTypes.length)]
        const o = createFakeOffer(offerIndex++, type)
        o.owner_id = fakeOrganizations[i].id
        fakeOffers.push(o)
      }
    }
    jsonDB.offer = [...jsonDB.offer, ...fakeOffers]
  })
  .then(() => {
    return writeJsonStub(jsonDB)
  })
}
