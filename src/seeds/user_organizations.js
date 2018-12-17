
import faker from 'faker'

const fakeUsers = []
const requiredUsers = 100

const fakeOrganizations = []
const requiredOrganizations = 15

var fakeUserOrgs = []

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('organization').del()
    .then(() => {
      return knex('user').del()
    })
    .then(() => {
      for (let i = 0; i < requiredUsers; i++) {
        const u = createFakeUser()
        // saving enough userIds so I can associate each
        // org with a user in the 'user_organizations' join table
        if (i < requiredOrganizations) fakeUserOrgs.push({userId: u.id})
        fakeUsers.push(u)
      }
      console.log(fakeUsers)
      return knex('user').insert(fakeUsers)
    })
    .then(() => {
      for (let i = 0; i < requiredOrganizations; i++) {
        const o = createFakeOrganization()
        fakeUserOrgs[i].organizationId = o.id
        fakeOrganizations.push(o)
      }
      console.log(fakeOrganizations)
      return knex('organization').insert(fakeOrganizations)
    })
    .then(() => {
      return knex('user_organizations').del()
    })
    .then(() => {
      console.log(fakeUserOrgs)
      // Inserts seed entries
      return knex('user_organizations').insert(fakeUserOrgs)
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
