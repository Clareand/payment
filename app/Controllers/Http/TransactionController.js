'use strict'

const Customer = use('App/Models/Customer')
const Transaction = use('App/Models/Transaction')
const PaymentService = use('App/Services/PaymentService') // Mocked payment service
const Database = use('Database')

class TransactionController {
  async deposit({ request, response }) {
    
    const { CustomerId, amount, orderId, timestamp } = request.only(['CustomerId', 'amount', 'orderId', 'timestamp'])
    console.log('orderID',orderId)

    // Start a transaction
    const trx = await Database.beginTransaction()

    try {
      // Lock the customer record for update within the transaction
      const customerInstance = await Customer.query(trx).where('customer_id', CustomerId).forUpdate().first()

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
          customer_id: CustomerId,
          type: 'deposit',
          amount,
          order_id: orderId,
          created_at:timestamp
        }, trx)

        await trx.commit()
        return response.status(201).json(transaction)
      } else {
        await trx.rollback()
        return response.status(500).json({ message: 'Deposit failed' })
      }
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ message: 'An error occurred', error: error.message })
    }
  }

  async withdraw({ request, response }) {
    const { CustomerId, amount, orderId, timestamp } = request.only(['CustomerId', 'amount', 'orderId', 'timestamp'])
    const customerInstance = await Customer.find(CustomerId)

    if (!customerInstance) {
      return response.status(404).json({ message: 'Customer not found' })
    }

    if (customerInstance.balance < amount) {
      return response.status(400).json({ message: 'Insufficient balance' })
    }

    const paymentResponse = await PaymentService.processWithdrawal(amount, orderId, timestamp)

    if (paymentResponse.status === 1) {
      await customerInstance.lockForUpdate()
      customerInstance.balance -= amount
      await customerInstances.save()

      const transaction = await Transaction.create({ Customer_id: CustomerId, type: 'withdrawal', amount, order_id: orderId, timestamp })
      return response.status(201).json(transaction)
    } else {
      return response.status(500).json({ message: 'Withdrawal failed' })
    }
  }
}

module.exports = TransactionController
