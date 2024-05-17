'use strict'

const Customer = use('App/Model/Customer')
class CustomerController {
    async create({ request, response }) {
        const data = request.only(['username'])
        const user = await Customer.create(data)
        return response.status(201).json(user)
      }
}

module.exports = CustomerController
