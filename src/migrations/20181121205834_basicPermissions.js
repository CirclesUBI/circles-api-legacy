const knex = require('knex')

const basicPermissions = [
  { role: 'user', resource: 'ownUser', action: 'create' },
  { role: 'user', resource: 'ownUser', action: 'update' },
  { role: 'user', resource: 'ownUser', action: 'delete' },
  { role: 'user', resource: 'ownUser', action: 'read' },

  { role: 'user', resource: 'ownOrgs', action: 'create' },
  { role: 'user', resource: 'ownOrgs', action: 'update' },
  { role: 'user', resource: 'ownOrgs', action: 'delete' },
  { role: 'user', resource: 'ownOrgs', action: 'read' },

  { role: 'user', resource: 'ownNotifs', action: 'update' },
  { role: 'user', resource: 'ownNotifs', action: 'read' },

  { role: 'user', resource: 'ownOffers', action: 'create' },
  { role: 'user', resource: 'ownOffers', action: 'update' },
  { role: 'user', resource: 'ownOffers', action: 'delete' },
  { role: 'user', resource: 'ownOffers', action: 'read' },

  { role: 'api', resource: 'allNotifs', action: 'create' },
  { role: 'api', resource: 'allNotifs', action: 'update' },
  { role: 'api', resource: 'allNotifs', action: 'delete' },
  { role: 'api', resource: 'allNotifs', action: 'read' }
]

// ownUser / allUsers / ownOffers / ownNotifs / ownOrgs /

exports.up = async (knex, Promise) => {
  await knex.schema.createTable('permission', t => {
    t.increments('id')
    t.string('role', 100).notNullable()
    t.string('resource', 100).notNullable()
    t.string('action', 100).notNullable()
    t.dateTime('created_at').notNullable()
    t.dateTime('updated_at')
  })
  return knex('permission').insert(
    basicPermissions.map(p => {
      p.created_at = new Date().toISOString()
      return p
    })
  )
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('permission')
}
