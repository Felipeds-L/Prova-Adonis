import Route from '@ioc:Adonis/Core/Route'


/*
  RF02 - Concluido
  RF03 - Concluido - parcial
  RF04 - Concluido - parcial
*/



Route.group(() => {
  Route.get('/', async () => {
    return {Obi_Message: 'Hello There!'}
  })

  Route.post('login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('/api')

Route.group(() =>{

  // Users Routes
  Route.put('/users', 'UsersController.update')
  Route.get('users', 'UsersController.index')
  Route.get('/users/:id', 'UsersController.show')
  Route.delete('/users', 'UsersController.delete')
  Route.post('/users/forgot-password','UsersController.forgotPassword')
  Route.get('/my-last-bet', 'UsersController.calculateLastBet')
  Route.get('/myBets', 'UsersController.myBets')


  Route.resource('/bet', 'BetsController')

  Route.resource('/games', 'GamesController')

  Route.resource('/level_access', 'LevelAccessesController')
  Route.resource('/user_level_access', 'UserLevelAccessesController')


}).middleware('auth')
