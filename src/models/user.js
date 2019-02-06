const CirclesModel = require('../lib/postgresModels')

module.exports = class User extends CirclesModel {
  static get tableName () {
    return 'user'
  }

  static get name () {
    return this.display_name
  }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        agreed_to_disclaimer: { type: 'boolean' }, // used for legal reasons, and to denote that the user has been fully set up
        created_at: { type: 'object' },
        updated_at: { type: 'object' },
        display_name: { type: 'string' },
        email: { type: 'string' },
        profile_pic_url: { type: 'string' },
        device_id: { type: 'string' },
        device_endpoint: { type: 'string' },
        phone_number: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
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
      },
      offers: {
        relation: CirclesModel.HasManyRelation,
        modelClass: `${__dirname}/offer`,
        join: {
          from: 'user.id',
          to: 'offer.owner_id'
        }
      }
    }
  }
}
