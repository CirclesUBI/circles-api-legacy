
import faker from 'faker'

const fakeUsers = []
const requiredUsers = 5

const fakeOrganizations = []
const requiredOrganizations = 2

var fakeUserOrgs = []

const fakeNotifications = []
const notificationsPerUser = 3

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('organization').del(),
    knex('user').del(),
    knex('user_organizations').del(),
    knex('notification').del()
  ])
    .then(() => {
      for (let i = 0; i < requiredUsers; i++) {
        const u = createFakeUser()
        // saving enough userIds so I can associate each
        // org with a user in the 'user_organizations' join table
        if (i < requiredOrganizations) fakeUserOrgs.push({userId: u.id})
        fakeUsers.push(u)
      }
      return knex('user').insert(fakeUsers)
    })
    .then(() => {
      for (let i = 0; i < requiredOrganizations; i++) {
        const o = createFakeOrganization()
        fakeUserOrgs[i].organizationId = o.id
        fakeOrganizations.push(o)
      }
      return knex('organization').insert(fakeOrganizations)
    })
    .then(() => {
      return knex('user_organizations').insert(fakeUserOrgs)
    })
    .then(() => {
      for (let i = 0; i < fakeUsers.length; i++) {
        for (let j = 0; j < notificationsPerUser; j++) {
          const n = createFakeNotification()
          n.user_id = fakeUsers[i].id
          fakeNotifications.push(n)
        }
      }
      return knex('notification').insert(fakeNotifications)
    })
}

const createFakeUser = () => {
  return {
    id: faker.random.uuid(),
    agreed_to_disclaimer: true, // used for legal reasons, and to denote that the user has been fully set up
    display_name: faker.name.firstName(),
    email: faker.internet.email(),
    profile_pic_url: faker.image.avatar(),
    device_id: faker.random.alphaNumeric(),
    phone_number: faker.phone.phoneNumber()
  }
}

const createFakeOrganization = () => {
  return {
    id: faker.random.uuid(),
    agreed_to_disclaimer: true, // used for legal reasons, and to denote that the user has been fully set up
    organization_name: faker.company.companyName(),
    email: faker.internet.email(),
    profile_pic_url: faker.image.business(),
    address: faker.address.streetAddress(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    description: faker.company.catchPhrase()
  }
}

const createFakeNotification = () => {
  return {
    description: faker.lorem.sentence()
  }
}
