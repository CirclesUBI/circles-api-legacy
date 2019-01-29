const faker = require('faker')

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
    case 'ITEM':
      offer.title = faker.commerce.productName()
      offer.description = faker.lorem.sentence()
      offer.amount = faker.random.number(250)
      offer.price = faker.commerce.price()
      break;
    case 'PERCENTAGE_ITEM':
      offer.title = faker.commerce.productName()
      offer.description = faker.lorem.sentence()
      offer.amount = faker.random.number(250)
      offer.percentage = faker.random.number(15)
      break;
    case 'PERCENTAGE_CATEGORY':
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

module.exports = { createFakeUser, createFakeOrganization, createFakeOffer, createFakeNotification }
