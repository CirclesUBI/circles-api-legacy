import CirclesModel from '../lib/postgresModels';

export default class User extends CirclesModel {
  static get tableName() { return 'user'; }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        agreedToDisclaimer: { type: 'boolean' }, //used for legal reasons, and to denote that the user has been fully set up
        createdAt: { type: 'object' },
        updatedAt: { type: 'object' },
        displayName: { type: 'string' },
        email: { type: 'string' },
        profilePicURL: { type: 'string' },
      },
    };
  }
}
