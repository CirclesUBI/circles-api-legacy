const CirclesModel = require('../lib/postgresModels');

module.exports = class Notification extends CirclesModel {
  static get tableName () { return 'notification' }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        description: { type: 'string' },
        created_at: { type: 'object' },
        updated_at: { type: 'object' },
        dismissed: { type: 'boolean' }
      }
    }
  }
}
