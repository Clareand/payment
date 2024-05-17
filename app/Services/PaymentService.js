class PaymentService {
    static async processDeposit(amount) {
      // Simulate third-party payment processing
      return { success: true, message: 'Deposit processed',status:1 }
    }
  
    static async processWithdrawal(amount) {
      // Simulate third-party payment processing
      return { success: true, message: 'Withdrawal processed',status:1  }
    }
  }
  
  module.exports = PaymentService
  