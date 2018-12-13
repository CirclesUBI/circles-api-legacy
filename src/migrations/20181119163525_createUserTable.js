
exports.up = (knex, Promise) => {
  return knex.schema.createTable('user', (t) => {
    t.string('id').primary();
    t.string('display_name', 100).notNullable();
    t.string('email', 50).notNullable();
    t.string('profile_pic_url', 500).notNullable();
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at');
    t.boolean('agreed_to_disclaimer').notNullable().defaultTo(false);
    t.string('device_id').notNullable();
    t.string('device_endpoint').notNullable();
    t.string('phone_number').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('user');
};
