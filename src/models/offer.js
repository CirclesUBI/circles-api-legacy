import CirclesModel from '../lib/postgresModels'

export default class Offer extends CirclesModel {
  static get tableName () { return 'offer' }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },        
        itemCode: { type: 'string' },
        type: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'object' },
        publishedAt: { type: 'object' },
        updatedAt: { type: 'object' },
        amount: { type: 'integer' },
        public: { type: 'boolean' },
        price: { type: 'float' },
        percentage: { type: 'float' },
        category: { type: 'string' },
        limitType: { type: 'string' },
        limitAmount: { type: 'integer' },
        limitPeriod: { type: 'string' },
        limitAmountSold: { type: 'integer' }
      }
    }
  }
}

// regex for prices
// [0-9]+(\.[0-9][0-9]?)? 