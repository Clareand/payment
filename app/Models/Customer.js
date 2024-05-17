'use strict'

const Model = use('Model')

class Customer extends Model {
  static get table () {
    return 'md_customers' // Specify the custom table name here
  }

  static get primaryKey() {
    return 'customer_id'
  }

  static get incrementing() {
    return false
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', async (customerInstance) => {
      customerInstance.customer_id = customerInstance.customer_id || require('uuid').v4()
    })
  }
}

module.exports = Customer