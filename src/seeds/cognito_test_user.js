const {
  createFakeOrganization,
  createFakeOffer,
  createFakeNotification
} = require('./helpers/fakers')

let testUser
let testOrg
let userOrgJoin = {}
let fakeNotifications = []
let fakeOffers = []

const notificationsPerUser = 5
const offersPerUser = 3
const offersPerOrg = 8

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return (
    Promise.all([
      knex('organization').del(),
      knex('user').del(),
      // knex('user_organizations').del(),
      knex('notification').del(),
      knex('offer').del()
    ])
      .then(() => {
        testUser = {
          id: '96b05fb0-13a1-4acb-8f39-505a7dedbcda',
          agreed_to_disclaimer: true, // used for legal reasons, and to denote that the user has been fully set up
          display_name: 'testuser',
          email: 'test@joincircles.net',
          profile_pic_url: 'testuser',
          device_id: 'deviceid',
          phone_number: '+00111111111111111'
        }
        return knex('user').insert(testUser)
      })
      .then(() => {
        testOrg = createFakeOrganization()
        // userOrgJoin.organization_id = testOrg.id
        // userOrgJoin.user_id =  testUser.id
        return knex('organization').insert(testOrg)
      })
      // .then(() => {
      //   return knex('user_organizations').insert(userOrgJoin)
      // })
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
  )
}