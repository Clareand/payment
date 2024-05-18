'use strict'

const jwt = require('jsonwebtoken');
const Customer = use('App/Models/Customer')

class CheckBearerToken {
  async handle({ request, response }, next) {
    // Get the Authorization header
    const authHeader = request.header('Authorization')

    // Check if the Authorization header is present and formatted correctly
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).send({
        message: 'Missing or malformed Bearer token',
      })
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '')

    // Decode the token from Base64
    let decodedToken
    try {
      decodedToken = Buffer.from(token, 'base64').toString('utf-8')
    } catch (error) {
      return response.status(401).send({
        message: 'Invalid Bearer token',
      })
    }

    // Fetch the full name from the database
    const customer = await Customer.query().where('username', decodedToken).first();

    // Check if the customer exists
    if (!customer) {
      return response.status(401).send({
        message: 'Invalid Bearer token',
      });
    }

    // Extract the CustomerId from the customer record
    const { customer_id: CustomerId } = customer;

    // Check if the CustomerId is present
    if (!CustomerId) {
      return response.status(401).send({
        message: 'CustomerId not found in token',
      });
    }

    // Attach the CustomerId to the request object for further use
    request.CustomerId = CustomerId;

    // Proceed to the next middleware or controller
    await next()
  }
}

module.exports = CheckBearerToken
