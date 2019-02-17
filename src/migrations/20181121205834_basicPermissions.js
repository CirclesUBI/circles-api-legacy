const basicPermissions = [
  { role: 'user', resource: 'ownUser', action: 'POST' },
  { role: 'user', resource: 'ownUser', action: 'PUT' },
  { role: 'user', resource: 'ownUser', action: 'DELETE' },
  { role: 'user', resource: 'ownUser', action: 'GET' },

  { role: 'user', resource: 'ownOrg', action: 'POST' },
  { role: 'user', resource: 'ownOrg', action: 'PUT' },
  { role: 'user', resource: 'ownOrg', action: 'DELETE' },
  { role: 'user', resource: 'ownOrg', action: 'GET' },

  { role: 'user', resource: 'ownNotif', action: 'PUT' },
  { role: 'user', resource: 'ownNotif', action: 'DELETE' },
  { role: 'user', resource: 'ownNotif', action: 'GET' },

  { role: 'user', resource: 'ownOffer', action: 'POST' },
  { role: 'user', resource: 'ownOffer', action: 'PUT' },
  { role: 'user', resource: 'ownOffer', action: 'DELETE' },
  { role: 'user', resource: 'ownOffer', action: 'GET' },
  { role: 'user', resource: 'allOffers', action: 'GET' },

  // API
  { role: 'api', resource: 'allNotifs', action: 'create' },
  { role: 'api', resource: 'allNotifs', action: 'update' },
  { role: 'api', resource: 'allNotifs', action: 'delete' },
  { role: 'api', resource: 'allNotifs', action: 'read' },

  // TEST
  { role: 'test', resource: 'allUsers', action: 'POST' },
  { role: 'test', resource: 'allUsers', action: 'PUT' },
  { role: 'test', resource: 'allUsers', action: 'DELETE' },
  { role: 'test', resource: 'allUsers', action: 'GET' },

  { role: 'test', resource: 'ownUser', action: 'POST' },
  { role: 'test', resource: 'ownUser', action: 'PUT' },
  { role: 'test', resource: 'ownUser', action: 'DELETE' },
  { role: 'test', resource: 'ownUser', action: 'GET' },

  { role: 'test', resource: 'allOrgs', action: 'POST' },
  { role: 'test', resource: 'allOrgs', action: 'PUT' },
  { role: 'test', resource: 'allOrgs', action: 'DELETE' },
  { role: 'test', resource: 'allOrgs', action: 'GET' },

  { role: 'test', resource: 'ownOrg', action: 'POST' },
  { role: 'test', resource: 'ownOrg', action: 'PUT' },
  { role: 'test', resource: 'ownOrg', action: 'DELETE' },
  { role: 'test', resource: 'ownOrg', action: 'GET' },

  { role: 'test', resource: 'allOffers', action: 'POST' },
  { role: 'test', resource: 'allOffers', action: 'PUT' },
  { role: 'test', resource: 'allOffers', action: 'DELETE' },
  { role: 'test', resource: 'allOffers', action: 'GET' },

  { role: 'test', resource: 'ownOffer', action: 'POST' },
  { role: 'test', resource: 'ownOffer', action: 'PUT' },
  { role: 'test', resource: 'ownOffer', action: 'DELETE' },
  { role: 'test', resource: 'ownOffer', action: 'GET' },

  { role: 'test', resource: 'allNotifs', action: 'POST' },
  { role: 'test', resource: 'allNotifs', action: 'PUT' },
  { role: 'test', resource: 'allNotifs', action: 'DELETE' },
  { role: 'test', resource: 'allNotifs', action: 'GET' },

  { role: 'test', resource: 'ownNotif', action: 'POST' },
  { role: 'test', resource: 'ownNotif', action: 'PUT' },
  { role: 'test', resource: 'ownNotif', action: 'DELETE' },
  { role: 'test', resource: 'ownNotif', action: 'GET' }
]

// ownUser / allUsers / ownOffers / ownNotifs / ownOrg /

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
