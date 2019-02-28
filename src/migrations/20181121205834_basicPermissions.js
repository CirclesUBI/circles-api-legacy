const basicPermissions = [
  { role: 'user', resource: 'ownUser', action: 'POST' },
  { role: 'user', resource: 'ownUser', action: 'PUT' },
  { role: 'user', resource: 'ownUser', action: 'DELETE' },
  { role: 'user', resource: 'ownUser', action: 'GET' },

  { role: 'user', resource: 'ownOrgs', action: 'POST' },
  { role: 'user', resource: 'ownOrgs', action: 'PUT' },
  { role: 'user', resource: 'ownOrgs', action: 'DELETE' },
  { role: 'user', resource: 'ownOrgs', action: 'GET' },

  { role: 'user', resource: 'ownNotifs', action: 'PUT' },
  { role: 'user', resource: 'ownNotifs', action: 'DELETE' },
  { role: 'user', resource: 'ownNotifs', action: 'GET' },

  { role: 'user', resource: 'ownOffers', action: 'POST' },
  { role: 'user', resource: 'ownOffers', action: 'PUT' },
  { role: 'user', resource: 'ownOffers', action: 'DELETE' },
  { role: 'user', resource: 'allOffers', action: 'GET' },

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

  { role: 'admin', resource: 'ownOrgs', action: 'POST' },
  { role: 'admin', resource: 'ownOrgs', action: 'PUT' },
  { role: 'admin', resource: 'ownOrgs', action: 'DELETE' },
  { role: 'admin', resource: 'ownOrgs', action: 'GET' },

  { role: 'admin', resource: 'allOffers', action: 'POST' },
  { role: 'admin', resource: 'allOffers', action: 'PUT' },
  { role: 'admin', resource: 'allOffers', action: 'DELETE' },
  { role: 'admin', resource: 'allOffers', action: 'GET' },

  { role: 'admin', resource: 'ownOffers', action: 'POST' },
  { role: 'admin', resource: 'ownOffers', action: 'PUT' },
  { role: 'admin', resource: 'ownOffers', action: 'DELETE' },
  { role: 'admin', resource: 'ownOffers', action: 'GET' },

  { role: 'admin', resource: 'allNotifs', action: 'POST' },
  { role: 'admin', resource: 'allNotifs', action: 'PUT' },
  { role: 'admin', resource: 'allNotifs', action: 'DELETE' },
  { role: 'admin', resource: 'allNotifs', action: 'GET' },

  { role: 'admin', resource: 'ownNotifs', action: 'POST' },
  { role: 'admin', resource: 'ownNotifs', action: 'PUT' },
  { role: 'admin', resource: 'ownNotifs', action: 'DELETE' },
  { role: 'admin', resource: 'ownNotifs', action: 'GET' }
]

// ownUser / allUsers / ownOfferss / ownNotifss / ownOrgs /

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
