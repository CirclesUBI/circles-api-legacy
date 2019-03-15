exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', t => {
      t.string('id').primary()
      t.string('name')
      t.string('username', 50).notNullable()
      t.string('display_name', 100).notNullable()
      t.string('email', 50).notNullable()
      t.boolean('email_verified').notNullable().defaultTo(false)
      t.string('profile_pic_url', 500).notNullable()
      t.dateTime('created_at')
        .notNullable()
        .defaultTo(knex.fn.now())
      t.dateTime('updated_at')
      t.boolean('agreed_to_disclaimer')
        .notNullable()
        .defaultTo(false)
      t.string('custom:device_id').notNullable()
      t.string('device_endpoint')
      t.string('phone_number').notNullable()
      t.string('phone_number_verified').notNullable().defaultTo(false)
      t.string('address').notNullable()
      t.string('token_address').notNullable()
    }),
    knex.schema.createTable('organization', t => {
      t.string('id').primary()
      t.string('owner_id').references('users.id')
      t.string('organization_name', 100).notNullable()
      t.string('email', 50).notNullable()
      t.string('profile_pic_url', 500).notNullable()
      t.dateTime('created_at')
        .notNullable()
        .defaultTo(knex.fn.now())
      t.dateTime('updated_at')
      t.dateTime('last_active')
      t.boolean('agreed_to_disclaimer')
        .notNullable()
        .defaultTo(false)
      t.string('address')
      t.float('latitude')
      t.float('longitude')
      t.text('description')
    })
    // knex.schema.createTable('user_organizations', t => {
    //   t.increments('id').primary()
    // t.string('user_id')
    //   .references('id')
    //   .inTable('user')
    //   .onDelete('CASCADE')
    //   .index()
    //   t.string('organization_id')
    //     .references('id')
    //     .inTable('organization')
    //     .onDelete('CASCADE')
    //     .index()
    // })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    // knex.schema.dropTable('user_organizations'),
    knex.schema.dropTable('organization'),
    knex.schema.dropTable('users')
  ])
}
