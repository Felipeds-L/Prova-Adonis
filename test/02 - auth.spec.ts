import test from 'japa'
import supertest from 'supertest'
const baseUrl = `http://localhost:3333`
import User from '../app/Models/User'

let token = ''

test.group('Auth', () =>{
  test('testing authentication', async () => {
    const user = new User()
    user.email = 'tddteste01@tdd.teste'
    user.password = 'tdd_password'

    const logged = await supertest(baseUrl).post('/api/login').send(user).expect(200);

    const json_log = JSON.parse(logged.text)

    token = json_log['token']['token']

  });
})




