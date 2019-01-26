const knex = require('knex');

const basicPermissions = [
  { role: 'user', resource: 'ownUser', action: 'create' },
  { role: 'user', resource: 'ownUser', action: 'update' },
  { role: 'user', resource: 'ownUser', action: 'delete' },
  { role: 'user', resource: 'ownUser', action: 'read' }
]

exports.up = async (knex, Promise) => {
  await knex.schema.createTable('permission', (t) => {
    t.increments('id')
    t.string('role', 100).notNullable()
    t.string('resource', 100).notNullable()
    t.string('action', 100).notNullable()
    t.dateTime('created_at').notNullable()
    t.dateTime('updated_at')
  })
  return knex('permission').insert(basicPermissions.map((p) => {
    p.created_at = new Date().toISOString() 
    return p
  }))
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('permission')
};
