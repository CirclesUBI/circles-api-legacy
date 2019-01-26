const CirclesModel = require('../lib/postgresModels');

module.exports = class Offer extends CirclesModel {
  static get tableName () { return 'offer' }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },        
        itemCode: { type: 'string' },
        type: { type: 'enum' },
        title: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'object' },
        publishedAt: { type: 'object' },
        updatedAt: { type: 'object' },
        amount: { type: 'integer' },
        public: { type: 'boolean' },
        price: { type: 'float' },
        percentage: { type: 'float' },
        category: { type: 'string' }
      }
    }
  }
}

// regex for prices
// [0-9]+(\.[0-9][0-9]?)? 