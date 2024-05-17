'use strict'

const Schema = use('Schema')

class Transaction extends Schema {
  up () {
    this.create('d_transactions', (table) => {
      table.uuid('transaction_id').primary().defaultTo(this.db.raw('uuid_generate_v4()'))
      table.uuid('customer_id').unsigned().references('customer_id').inTable('md_customers')
      table.enu('type', ['deposit', 'withdrawal']).notNullable()
      table.integer('amount').notNullable()
      table.string('order_id').notNullable()
      table.timestamp('created_at', { useTz: false }).defaultTo(this.fn.now()).nullable()
      table.timestamp('updated_at', { useTz: false }).defaultTo(this.fn.now()).nullable()
    })
  }

  down () {
    this.drop('d_transactions')
  }
}

module.exports = Transaction