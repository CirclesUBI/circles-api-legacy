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
  { role: 'api', resource: 'allNotifs', action: 'POST' },
  { role: 'api', resource: 'allNotifs', action: 'PUT' },
  { role: 'api', resource: 'allNotifs', action: 'DELETE' },
  { role: 'api', resource: 'allNotifs', action: 'GET' },

  // TEST
  { role: 'admin', resource: 'allUsers', action: 'POST' },
  { role: 'admin', resource: 'allUsers', action: 'PUT' },
  { role: 'admin', resource: 'allUsers', action: 'DELETE' },
  { role: 'admin', resource: 'allUsers', action: 'GET' },

  { role: 'admin', resource: 'ownUser', action: 'POST' },
  { role: 'admin', resource: 'ownUser', action: 'PUT' },
  { role: 'admin', resource: 'ownUser', action: 'DELETE' },
  { role: 'admin', resource: 'ownUser', action: 'GET' },

  { role: 'admin', resource: 'allOrgs', action: 'POST' },
  { role: 'admin', resource: 'allOrgs', action: 'PUT' },
  { role: 'admin', resource: 'allOrgs', action: 'DELETE' },
  { role: 'admin', resource: 'allOrgs', action: 'GET' },

  { role: 'admin', resource: 'ownOrg', action: 'POST' },
  { role: 'admin', resource: 'ownOrg', action: 'PUT' },
  { role: 'admin', resource: 'ownOrg', action: 'DELETE' },
  { role: 'admin', resource: 'ownOrg', action: 'GET' },

  { role: 'admin', resource: 'allOffers', action: 'POST' },
  { role: 'admin', resource: 'allOffers', action: 'PUT' },
  { role: 'admin', resource: 'allOffers', action: 'DELETE' },
  { role: 'admin', resource: 'allOffers', action: 'GET' },

  { role: 'admin', resource: 'ownOffer', action: 'POST' },
  { role: 'admin', resource: 'ownOffer', action: 'PUT' },
  { role: 'admin', resource: 'ownOffer', action: 'DELETE' },
  { role: 'admin', resource: 'ownOffer', action: 'GET' },

  { role: 'admin', resource: 'allNotifs', action: 'POST' },
  { role: 'admin', resource: 'allNotifs', action: 'PUT' },
  { role: 'admin', resource: 'allNotifs', action: 'DELETE' },
  { role: 'admin', resource: 'allNotifs', action: 'GET' },

  { role: 'admin', resource: 'ownNotif', action: 'POST' },
  { role: 'admin', resource: 'ownNotif', action: 'PUT' },
  { role: 'admin', resource: 'ownNotif', action: 'DELETE' },
  { role: 'admin', resource: 'ownNotif', action: 'GET' }
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
