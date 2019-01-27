
exports.up = (knex, Promise) => {
  return knex.schema.createTable('offer', (t) => {
    t.increments('id').primary()
    t.string('owner_id', 50)
    t.string('item_code', 50)
    t.enu('type', ['ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY']).notNullable()
    t.string('title', 50).notNullable()
    t.string('description', 250).notNullable()
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    t.dateTime('published_at')
    t.dateTime('updated_at')
    t.integer('amount')
    t.boolean('public').notNullable().defaultTo(false)
    t.float('price')
    t.float('percentage')
    t.string('category', 50)
  })
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('offer'),
  ])
}
