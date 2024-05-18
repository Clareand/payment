'use strict'

const Customer = use('App/Models/Customer')
const Transaction = use('App/Models/Transaction')
const PaymentService = use('App/Services/PaymentService') // Mocked payment service
const Database = use('Database')

class TransactionController {
  async deposit({ request, response }) {
    const type = 'deposit'
    const {amount, orderId, timestamp } = request.only(['amount', 'orderId', 'timestamp'])
    const customerId = request.CustomerId;

    // Start a transaction
    const trx = await Database.beginTransaction()

    try {
      // Lock the customer record for update within the transaction
      const customerInstance = await Customer.query(trx).where('customer_id', customerId).forUpdate().first()

      if (!customerInstance) {
        await trx.rollback()
        return response.status(404).json({ message: 'Customer not found' })
      }

      const paymentResponse = await PaymentService.processDeposit(amount, orderId, timestamp)

      if (paymentResponse.status === 1) {
        const balance = parseInt(customerInstance.balance = customerInstance.balance) + parseInt(amount);
        customerInstance.balance = balance
        await customerInstance.save(trx)

        const transaction = await Transaction.create({
          customer_id: customerId,
          type: type,
          amount,
          order_id: orderId,
          created_at:timestamp,
          status : 1
        }, trx)
        await trx.commit()
        return response.status(201).json(transaction)
      } else {
        await Transaction.create({
          customer_id: customerId,
          type: type,
          amount,
          order_id: orderId,
          created_at:timestamp,
          status : 2
        }, trx)
        await trx.commit()
        return response.status(500).json({ message: 'Deposit failed' })
      }
    } catch (error) {
      await Transaction.create({
        customer_id: customerId,
        type: 'deposit',
        amount,
        order_id: orderId,
        created_at:timestamp,
        status : 2
      }, trx)
      await trx.commit()
      return response.status(500).json({ message: 'An error occurred', error: error.message })
    }
  }

  async withdraw({ request, response }) {
    const type = 'withdrawal'
    const { amount, orderId, timestamp } = request.only(['amount', 'orderId', 'timestamp'])
    const customerId = request.CustomerId;
    const customerInstance = await Customer.find(customerId)

    const trx = await Database.beginTransaction()

    try {
      // Lock the customer row for update
      const customer = await Customer.query().where('customer_id', customerId).forUpdate().transacting(trx).first()

      if (!customer) {
        await trx.rollback()
        return response.status(404).json({ message: 'Customer not found' })
      }

      if (customer.balance < amount) {
        await trx.rollback()
        return response.status(400).json({ message: 'Insufficient balance' })
      }

      const paymentResponse = await PaymentService.processWithdrawal(amount, orderId, timestamp)

      if (paymentResponse.status === 1) {
        customer.balance -= amount
        await customer.save(trx)

        const transaction = await Transaction.create({
          customer_id: customerId,
          type: type,
          amount,
          order_id: orderId,
          created_at:timestamp,
        }, trx)

        await trx.commit()
        return response.status(201).json(transaction)
      } else {
        await Transaction.create({
          customer_id: customerId,
          type: type,
          amount,
          order_id: orderId,
          created_at:timestamp,
          status : 2
        }, trx)
        await trx.commit()
        return response.status(500).json({ message: 'Withdrawal failed' })
      }
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ message: 'An error occurred', error: error.message })
    }
  }
}

module.exports = TransactionController
