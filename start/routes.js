'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.group(()=>{
    Route.get('/test', 'DatabaseController.checkConnection').middleware(['checkBearer'])
    Route.post('/users', 'UserController.create')
    Route.post('/deposit', 'TransactionController.deposit').middleware(['checkBearer'])
    Route.post('/withdraw', 'TransactionController.withdraw').middleware(['checkBearer'])
    Route.get('/history', 'TransactionController.history').middleware(['checkBearer'])
}).prefix('api/v1')