import CirclesModel from '../lib/postgresModels'

export default class User extends CirclesModel {
  static get tableName () { return 'user' }

  static get name () { return this.displayName }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        agreedToDisclaimer: { type: 'boolean' }, // used for legal reasons, and to denote that the user has been fully set up
        createdAt: { type: 'object' },
        updatedAt: { type: 'object' },
        displayName: { type: 'string' },
        email: { type: 'string' },
        profilePicUrl: { type: 'string' },
        deviceId: { type: 'string' },
        deviceEndpoint: { type: 'string' },
        phoneNumber: { type: 'string' },
        // notifications: { type: 'object' }
      }
    }
  }

  static get relationMappings () {
    // Import models here to prevent require loops.
    // const Organization = require('./organization')
    // const Notification = require('./notification')

    return {
      organizations: {
        relation: CirclesModel.ManyToManyRelation,
        modelClass: `${__dirname}/organization`,
        join: {
          from: 'user.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'user_organizations.user_id',
            to: 'user_organizations.organization_id'
          },
          to: 'organization.id'
        }
      },
      notifications: {
        relation: CirclesModel.HasManyRelation,
        modelClass: `${__dirname}/notification`,
        join: {
          from: 'user.id',
          to: 'notification.user_id'
        }
      }
    }
  }
}
