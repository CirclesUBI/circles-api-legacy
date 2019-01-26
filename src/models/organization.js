const CirclesModel = require('../lib/postgresModels');

module.exports = class Organization extends CirclesModel {
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
    return {
      members: {
        relation: CirclesModel.ManyToManyRelation,
        modelClass: `${__dirname}/user`, // Import models like this to prevent require loops.
        join: {
          from: 'organization.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'user_organizations.organization_id',
            to: 'user_organizations.user_id'
          },
          to: 'user.id'
        }
      }
    }
  }
}
