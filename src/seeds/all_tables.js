
const faker = require('faker');

const fakeUsers = []
const requiredUsers = 5

const fakeOrganizations = []
const requiredOrganizations = 2

var fakeUserOrgs = []

const fakeNotifications = []
const notificationsPerUser = 3

var fakeOffers = []
const offersPerUser = 1
const offersPerOrg = 3
var offerIndex = 0 
const offerTypes = ['item', 'percentage_item', 'percentage_category']

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
        if (i < requiredOrganizations) {
          fakeUserOrgs.push({user_id: u.id})
        }
        fakeUsers.push(u)
      }
      return knex('user').insert(fakeUsers)
    })
    .then(() => {
      for (let i = 0; i < requiredOrganizations; i++) {
        const o = createFakeOrganization()
        fakeUserOrgs[i].organization_id = o.id
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
    .then(() => {
      for (let i = 0; i < fakeUsers.length; i++) {
        for (let j = 0; j < offersPerUser; j++) {     
          const type = offerTypes[Math.floor(Math.random()*offerTypes.length)]
          const o = createFakeOffer(offerIndex++, type)
          o.user_id = fakeUsers[i].id
          fakeOffers.push(o)
        }
      }
      return knex('offer').insert(fakeOffers)
    })
    .then(() => {
      fakeOffers = []
      for (let i = 0; i < fakeOrganizations.length; i++) {
        for (let j = 0; j < offersPerOrg; j++) {
          const type = offerTypes[Math.floor(Math.random()*offerTypes.length)]
          const o = createFakeOffer(offerIndex++, type)
          o.organization_id = fakeOrganizations[i].id
          fakeOffers.push(o)
        }
      }
      return knex('offer').insert(fakeOffers)
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

const createFakeOffer = (index, type) => {
  let offer = {
    id: index,
    type: type,
    public: faker.random.boolean(),
    category: faker.commerce.department()
  }
  switch (type) {
    case 'item':
      offer.title = faker.commerce.productName()
      offer.description = faker.lorem.sentence()
      offer.amount = faker.random.number(250)
      offer.price = faker.commerce.price()
      break;
    case 'percentage_item':
      offer.title = faker.commerce.productName()
      offer.description = faker.lorem.sentence()
      offer.amount = faker.random.number(250)
      offer.percentage = faker.random.number(15)
      break;
    case 'percentage_category':
      let percent = faker.random.number(15)
      offer.title = percent + '% Circles on all ' + faker.commerce.department()
      offer.description = faker.lorem.sentence()
      offer.percentage = percent
      break;
    default:
      console.error('switch statement fail')
      break;
  }  
  return offer
}
