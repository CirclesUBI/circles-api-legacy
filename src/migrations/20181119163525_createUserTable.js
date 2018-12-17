
exports.up = (knex, Promise) => {
  return knex.schema.createTable('user', (t) => {
    t.string('id').primary()
    t.string('display_name', 100).notNullable()
    t.string('email', 50).notNullable()
    t.string('profile_pic_url', 500).notNullable()
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    t.dateTime('updated_at')
    t.boolean('agreed_to_disclaimer').notNullable().defaultTo(false)
    t.string('device_id').notNullable()
    t.string('device_endpoint')
    t.string('phone_number').notNullable()
  }).createTable('organization', (t) => {
    t.string('id').primary()
    t.string('organization_name', 100).notNullable()
    t.string('email', 50).notNullable()
    t.string('profile_pic_url', 500).notNullable()
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    t.dateTime('updated_at')
    t.dateTime('last_active')
    t.boolean('agreed_to_disclaimer').notNullable().defaultTo(false)
    t.string('address')
    t.float('latitude')
    t.float('longitude')
    t.text('description')
  }).createTable('user_organizations', (t) => {
    t.increments('id').primary()
    t.string('userId').references('id').inTable('user')
    t.string('organizationId').references('id').inTable('organization')
  })
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('user_organizations'),
    knex.schema.dropTable('organization'),
    knex.schema.dropTable('user')
  ])
}