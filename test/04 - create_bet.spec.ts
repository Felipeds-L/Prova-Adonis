import test from 'japa'
import supertest from 'supertest'
const baseUrl = `localhost:3333`
import User from '../app/Models/User'
import Bet from '../app/Models/Bet'
import Game from 'App/Models/Game'

test.group('CRUD - Bet', async (group) => {
  let token = ''
  group.before(async () => {
    const user = new User()

    user.email = 'tddteste01@tdd.teste'
    user.password = 'tdd_password'

    const logged = await supertest(baseUrl).post('/api/login').send(user).expect(200);

    const json_log = JSON.parse(logged.text)

    token = json_log['token']['token']
  })

  test('create a bet, from the Mega-Sena game', async() => {
    let bet = new Bet()

    const game = await Game.findOrFail(2)
    const numbers = generateNumber(game)

    bet.user_id = 16,
    bet.game_id = 2,
    bet.numbers_choosed = numbers
    const trying = await supertest(baseUrl).post('/bet').send({bets: [bet]}).expect(200).set('Authorization', `Bearer ${token}`)
    console.log(JSON.parse(trying.text))
  }).timeout(6000)
})

function generateNumber(game){
  let check: number[] = [], lista: number[] = []
  while(check.length < game.max_number){
    const valor = Math.floor(Math.random()*game.range+1);
    lista.push(valor)
    check = [... new Set(lista)]
  }
  let number = check.toString()
  lista = []
  return number
}
