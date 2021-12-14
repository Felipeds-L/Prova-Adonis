import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Bet from 'App/Models/Bet';

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()

    return user
  }

  public async store({request}: HttpContextContract) {
    const data = request.only(['email', 'username', 'password', 'level_access'])
    const user = await User.create(data)

    return user;
  }
  // só está retornando uma unica aposta
  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    return user
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async showUserBet({ auth }: HttpContextContract){
    const user = await User.findOrFail(auth.user?.id)
    const bet = await Bet.findByOrFail('user_id', auth.user?.id)
    const bets = await Bet.query().where('user_id', bet.id)

    return {User: user, Bets: bets}
  }
}
