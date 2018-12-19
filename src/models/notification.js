import CirclesModel from '../lib/postgresModels'

export default class Notification extends CirclesModel {
  static get tableName () { return 'notification' }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        description: { type: 'string' },
        createdAt: { type: 'object' },
        updatedAt: { type: 'object' },
        dismissed: { type: 'boolean' }
      }
    }
  }
}
