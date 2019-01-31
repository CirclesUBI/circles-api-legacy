const CirclesModel = require('../lib/postgresModels');

module.exports = class Permission extends CirclesModel {
  static get tableName() { return 'permission'; }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        created_at: { type: 'object' },
        updated_at: { type: 'object' },
        role: { type: 'string' },
        resource: { type: 'string' },
        action: { type: 'string' }
      },
    };
  }
}
