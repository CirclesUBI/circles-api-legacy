const {
  createFakeUser,
  createFakeOrganization,
  createFakeOffer,
  createFakeNotification
} = require('./helpers/fakers')

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

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return (
    Promise.all([
      knex('organization').del(),
      knex('user').del(),
      knex('notification').del(),
      knex('offer').del()
    ])
      .then(() => {
        console.log('users...')
        for (let i = 0; i < requiredUsers; i++) {
          const u = createFakeUser()
          // saving enough userIds so I can associate each
          // org with a user in the 'user_organizations' join table
          if (i < requiredOrganizations) {
            fakeUserOrgs.push({ owner_id: u.id })
          }
          fakeUsers.push(u)
        }
        return knex('user').insert(fakeUsers)
      })
      .then(() => {
        console.log('organization...')
        for (let i = 0; i < requiredOrganizations; i++) {
          const o = createFakeOrganization()
          o.owner_id = fakeUsers[i].id
          fakeUserOrgs[i].organization_id = o.id
          fakeOrganizations.push(o)
        }
        return knex('organization').insert(fakeOrganizations)
      })
      // .then(() => {
      //   return knex('user_organizations').insert(fakeUserOrgs)
      // })
      .then(() => {
        console.log('notification...')
        for (let i = 0; i < fakeUsers.length; i++) {
          for (let j = 0; j < notificationsPerUser; j++) {
            const n = createFakeNotification()
            n.owner_id = fakeUsers[i].id
            fakeNotifications.push(n)
          }
        }
        return knex('notification').insert(fakeNotifications)
      })
      .then(() => {
        console.log('offer...')
        for (let i = 0; i < fakeUsers.length; i++) {
          for (let j = 0; j < offersPerUser; j++) {
            const o = createFakeOffer()
            o.owner_id = fakeUsers[i].id
            fakeOffers.push(o)
          }
        }
        return knex('offer').insert(fakeOffers)
      })
      .then(() => {
        console.log('offer again...')
        fakeOffers = []
        for (let i = 0; i < fakeOrganizations.length; i++) {
          for (let j = 0; j < offersPerOrg; j++) {
            const o = createFakeOffer()
            o.owner_id = fakeOrganizations[i].id
            fakeOffers.push(o)
          }
        }
        return knex('offer').insert(fakeOffers)
      })
  )
}
