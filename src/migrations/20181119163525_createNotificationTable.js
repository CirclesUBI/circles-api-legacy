exports.up = (knex, Promise) => {
  return knex.schema.createTable('notification', t => {
    t.increments('id').primary()
    t.string('user_id', 50).notNullable()
    t.string('description', 100).notNullable()
    t.dateTime('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
    t.dateTime('updated_at')
    t.boolean('dismissed')
      .notNullable()
      .defaultTo(false)
  })
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('notification')])
}
