const faker = require('faker')
const offerTypes = ['ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY']

const createFakeUser = () => {
  return {
    id: faker.random.uuid(),
    agreed_to_disclaimer: true, // used for legal reasons, and to denote that the user has been fully set up
    display_name: faker.name.firstName(),
    email: faker.internet.email(),
    profile_pic_url: faker.image.avatar(),
    device_id: faker.random.alphaNumeric(),
    phone_number: faker.helpers.replaceSymbolWithNumber('+49###########')
  }
}

const createFakeCognitoUser = () => {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    picture: faker.image.avatar(),
    'custom:device_id': faker.random.uuid(),
    phone_number: faker.helpers.replaceSymbolWithNumber('+49###########')
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
    id: faker.random.uuid(),
    description: faker.lorem.sentence()
  }
}

const createFakeOffer = () => {
  let offer = {
    id: faker.random.uuid(),
    type: offerTypes[Math.floor(Math.random() * offerTypes.length)],
    public: faker.random.boolean(),
    category: faker.commerce.department()
  }
  switch (offer.type) {
    case 'ITEM':
      offer.title = faker.commerce.productName()
      offer.description = faker.lorem.sentence()
      offer.amount = faker.random.number(250)
      offer.price = Number(
        faker.random.number(250) + '.' + faker.random.number(99)
      )
      break
    case 'PERCENTAGE_ITEM':
      offer.title = faker.commerce.productName()
      offer.description = faker.lorem.sentence()
      offer.amount = faker.random.number(250)
      offer.percentage = faker.random.number(15)
      break
    case 'PERCENTAGE_CATEGORY':
      let percent = faker.random.number(15)
      offer.title = percent + '% Circles on all ' + faker.commerce.department()
      offer.description = faker.lorem.sentence()
      offer.percentage = percent
      break
    default:
      console.error('switch statement fail')
      break
  }
  return offer
}

module.exports = {
  createFakeUser,
  createFakeCognitoUser,
  createFakeOrganization,
  createFakeOffer,
  createFakeNotification
}
