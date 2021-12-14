import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: 'felipe@leite.com',
        username: 'SrMilk',
        password: 'MyPassword',
        level_access: true
      },
      {
        email: 'tayna@vieira.com',
        username: 'tatá',
        password: 'otherPassword'
      },
      {
        email: 'Mayra@Santos.com',
        username: 'Mi',
        password: 'chemistry'
      },
      {
        email: 'daniel@vieira.com',
        username: 'Corno',
        password: 'Ass Whole',
        level_access: true
      }
    ])
  }
}
