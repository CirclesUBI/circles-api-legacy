const CirclesModel = require('../lib/postgresModels')

module.exports = class Organization extends CirclesModel {
  static get tableName () {
    return 'organization'
  }

  static get name () {
    return this.display_name
  }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        owner_id: { type: 'string' },
        agreed_to_disclaimer: { type: 'boolean' }, // used for legal reasons, and to denote that the user has been fully set up
        created_at: { type: 'object' },
        updated_at: { type: 'object' },
        last_active: { type: 'object' },
        organization_name: { type: 'string' },
        email: { type: 'string' },
        profile_pic_url: { type: 'string' },
        address: { type: 'string' },
        latitude: { type: 'float' },
        longitude: { type: 'float' },
        description: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    return {
      offers: {
        relation: CirclesModel.HasManyRelation,
        modelClass: `${__dirname}/offer`,
        join: {
          from: 'organization.id',
          to: 'offer.owner_id'
        }
      },
      owner: {
        relation: CirclesModel.BelongsToOneRelation,
        modelClass: `${__dirname}/user`,
        join: {
          from: 'organization.owner_id',
          to: 'users.id'
        }
      }
    }
  }
}
