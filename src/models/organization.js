import CirclesModel from '../lib/postgresModels'

export default class Organization extends CirclesModel {
  static get tableName () { return 'organization' }

  static get name () { return this.displayName }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        agreedToDisclaimer: { type: 'boolean' }, // used for legal reasons, and to denote that the user has been fully set up
        createdAt: { type: 'object' },
        updatedAt: { type: 'object' },
        lastActive: { type: 'object' },
        organizationName: { type: 'string' },
        email: { type: 'string' },
        profilePicURL: { type: 'string' },        
        address: { type: 'string' },
        latitude: { type: 'float' },
        longitude: { type: 'float' },
        description: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    // Import models here to prevent require loops.
    const Organization = require('./organization')

    return {
      users: {
        relation: CirclesModel.ManyToManyRelation,
        modelClass: Organization,
        join: {
          from: 'organization.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'user_organizations.organizationId',
            to: 'user_organizations.userId'
          },
          to: 'users.id'
        }
      }
    }
  }
}
