'use strict'

const Database = use('Database')

class DatabaseController {
  async checkConnection({ response }) {
    console.log("check")
    try {
      // Perform a simple query to check the connection
      const result = await Database.raw('SELECT 1+1 AS result')
      
      // Return the result of the query
      return response.json({
        message: 'Database connection successful',
        data: result.rows
      })
    } catch (error) {
      // Handle any errors
      console.error(error)
      return response.status(500).json({ error: 'Database connection failed' })
    }
  }
}

module.exports = DatabaseController
