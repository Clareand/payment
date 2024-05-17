'use strict'

const Schema = use('Schema')

class Customer extends Schema {
  up () {
    this.create('md_customers', (table) => {
      table.uuid('customer_id').primary().defaultTo(this.db.raw('uuid_generate_v4()'))
      table.string('customer_email')
      table.string('username').unique()
      table.bigInteger('balance').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: false }).defaultTo(this.fn.now()).nullable()
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.fn.now()).nullable()
      table.boolean('is_deleted').nullable().defaultTo(false)
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('md_customers')
  }
}

module.exports = Customer