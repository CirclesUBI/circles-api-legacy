import CirclesModel from '../lib/postgresModels';

export default class Permission extends CirclesModel {
  static get tableName() { return 'permission'; }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        createdAt: { type: 'object' },
        updatedAt: { type: 'object' },
        role: { type: 'string' },
        resource: { type: 'string' },
        action: { type: 'string' },
      },
    };
  }
}
