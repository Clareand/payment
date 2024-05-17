'use strict'

const Model = use('Model')

class Transaction extends Model {
  static get table () {
    return 'd_transactions' // Specify the custom table name here
  }
  static get primaryKey() {
    return 'transaction_id'
  }

  static get incrementing() {
    return false
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at'])
  }

  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return value.format('YYYY-MM-DD HH:mm:ss')
    }
    return super.formatDates(field, value)
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', async (transactionInstance) => {
      transactionInstance.transaction_id = transactionInstance.transaction_id || require('uuid').v4()
    })
    this.addHook('beforeSave', async (transactionInstance) => {
      transactionInstance.updated_at = new Date()
    })
  }
}

module.exports = Transaction
