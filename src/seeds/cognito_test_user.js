const {
  createFakeOrganization,
  createFakeOffer,
  createFakeNotification
} = require('./helpers/fakers')

let testUser
let testOrg
let fakeNotifications = []
let fakeOffers = []

const notificationsPerUser = 5
const offersPerUser = 3
const offersPerOrg = 8

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('organization').del(),
    knex('user').del(),
    knex('notification').del(),
    knex('offer').del()
  ])
    .then(() => {
      testUser = {
        id: 'test',
        username: 'test',
        display_name: 'Test User',
        address: '0x',
        token_address: '0x',
        email_verified: true,
        name: 'Test User',
        phone_number_verified: true,
        phone_number: '+111111111111111111',
        email: 'test@joincircles.net',
        profile_pic_url:
          'http://ribstf.org/wp-content/uploads/2015/11/empty-profile-pic.png',
        'custom:device_id': 'test_device_id'
      }
      //   id: '96b05fb0-13a1-4acb-8f39-505a7dedbcda',
      //   agreed_to_disclaimer: true, // used for legal reasons, and to denote that the user has been fully set up
      //   display_name: 'testuser',
      //   email: 'test@joincircles.net',
      //   profile_pic_url: 'testuser',
      //   device_id: 'deviceid',
      //   phone_number: '+00111111111111111'
      // }
      return knex('users').insert(testUser)
    })
    .then(() => {
      testOrg = createFakeOrganization()
      testOrg.owner_id = testUser.id
      return knex('organization').insert(testOrg)
    })
    .then(() => {
      for (let j = 0; j < notificationsPerUser; j++) {
        const n = createFakeNotification()
        n.owner_id = testUser.id
        fakeNotifications.push(n)
      }
      return knex('notification').insert(fakeNotifications)
    })
    .then(() => {
      for (let j = 0; j < offersPerUser; j++) {
        const o = createFakeOffer()
        o.owner_id = testUser.id
        fakeOffers.push(o)
      }
      return knex('offer').insert(fakeOffers)
    })
    .then(() => {
      fakeOffers = []
      for (let j = 0; j < offersPerOrg; j++) {
        const o = createFakeOffer()
        o.owner_id = testOrg.id
        fakeOffers.push(o)
      }
      return knex('offer').insert(fakeOffers)
    })
}
