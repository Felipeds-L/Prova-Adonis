import Route from '@ioc:Adonis/Core/Route'


/*
  RF02 - Concluido
  RF03 - Concluido - parcial
  RF04 - Concluido - parcial
*/



Route.group(() => {
  Route.get('/', async () => {

  })

  Route.post('login', 'AuthController.login')
  Route.post('/users', 'UsersController.store')
}).prefix('/api')

Route.group(() =>{


  Route.get('users/me', 'UsersController.showUserBet')
  Route.resource('/users', 'UsersController')
  Route.post('/users/email','UsersController.sendMail')
  Route.get('/my-last-bet', 'UsersController.calculateLastBet')

  Route.get('/myBets', 'BetsController.myBets')
  Route.resource('/bet', 'BetsController')

  Route.resource('/games', 'GamesController')

  Route.resource('/level_access', 'LevelAccessesController')

  Route.resource('/user_level_access', 'UserLevelAccessesController')


}).middleware('auth')
