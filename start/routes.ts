import Route from '@ioc:Adonis/Core/Route'

/*
  RF02 - Concluido
  RF03 - Concluido - parcial
  RF04 - Concluido - parcial
*/



Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  Route.post('login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('/api')

Route.group(() =>{
  Route.resource('/bet', 'BetsController')
  Route.get('users/me', 'UsersController.showUserBet')
  Route.get('/myBets', 'BetsController.myBets')
  Route.resource('/users', 'UsersController')
}).middleware('auth')
