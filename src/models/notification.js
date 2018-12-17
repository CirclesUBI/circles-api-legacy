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

  // static get relationMappings () {
  //   // Import models here to prevent require loops.
  //   const Organization = require('./organization')

  //   return {
  //     users: {
  //       relation: CirclesModel.ManyToManyRelation,
  //       modelClass: Organization,
  //       join: {
  //         from: 'organization.id',
  //         // ManyToMany relation needs the `through` object
  //         // to describe the join table.
  //         through: {
  //           // If you have a model class for the join table
  //           // you need to specify it like this:
  //           // modelClass: PersonMovie,
  //           from: 'user_organizations.organizationId',
  //           to: 'user_organizations.userId'
  //         },
  //         to: 'users.id'
  //       }
  //     }
  //   }
  // }
}
