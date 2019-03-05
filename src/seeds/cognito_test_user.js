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
        email_verified: true,
        name: 'Test User',
        phone_number_verified: true,
        phone_number: '+111111111111111111',
        email: 'test@joincircles.net',
        picture:
          'http://ribstf.org/wp-content/uploads/2015/11/empty-profile-pic.png',
        'custom:device_id': 'test_device_id'
      }
      return knex('user').insert(testUser)
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
