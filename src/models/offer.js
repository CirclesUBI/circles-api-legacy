const CirclesModel = require('../lib/postgresModels')

module.exports = class Offer extends CirclesModel {
  static get tableName () {
    return 'offer'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        owner_id: { type: 'string' },
        item_code: { type: 'string' },
        type: {
          type: 'string',
          enum: ['ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY']
        },
        title: { type: 'string' },
        description: { type: 'string' },
        created_at: { type: 'object' },
        updated_at: { type: 'object' },
        amount: { type: 'integer' },
        public: { type: 'boolean' },
        price: { type: 'number', multipleOf: 0.01 },
        percentage: { type: 'number', multipleOf: 0.1 },
        category: { type: 'string' }
      }
    }
  }
}

// regex for prices
// [0-9]+(\.[0-9][0-9]?)?
