import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Bet from 'App/Models/Bet';

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()

    return user
  }

  public async store({request}: HttpContextContract) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    return user;
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    return user
  }

  public async update({ params, request }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['email', 'username', 'password'])

    try{
      user.merge(data)
      await user.save()
      return {updated: user}
    }catch{
      return {Error: "Error to update user datas"}
    }

  }

  public async destroy({ auth, params }: HttpContextContract) {
    const userLogged = await User.findOrFail(auth.user?.id)

    if(userLogged === params.id){
      try{
        userLogged.delete()
        return { Deleted: true}
      }catch{
        return {Error: 'Error on delete user'}
      }
    }else{
      return {Error: `The user who's logged is not the one that you are trying delete`}
    }
  }

  public async showUserBet({ auth }: HttpContextContract){
    const user = await User.findOrFail(auth.user?.id)
    const bet = await Bet.findByOrFail('user_id', auth.user?.id)
    const bets = await (await Bet.query().where('user_id', bet.id))


    return {User: user, Bets: bets}
  }

}
