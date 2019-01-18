import CirclesModel from '../lib/postgresModels'

export default class Notification extends CirclesModel {
  static get tableName () { return 'notification' }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        type: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'object' },
        updatedAt: { type: 'object' },
        amount: { type: 'integer' },
        public: { type: 'boolean' },
        price: { type: 'float' }
      }
    }
  }
}

// regex for prices
// [0-9]+(\.[0-9][0-9]?)? 