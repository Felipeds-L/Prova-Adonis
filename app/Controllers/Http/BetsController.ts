import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/User'


export default class BetsController {
  public async index({}: HttpContextContract) {
    const bet = await Bet.all()

    return bet
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.only(['user_id','game_id', 'number_choosed'])
    const game = await Game.findOrFail(data.game_id)
    const user = await User.findOrFail(auth.user?.id)

    if(game.max_number === data.number_choosed.length){
      const bet = await Bet.create({
        user_id: user.id,
        game_id: data.game_id,
        numbers_choosed: data.number_choosed
      })
      return {bet: bet}
    }else{
      return `Error: você deve selecionar ${game.max_number} números, nesse jogo. Você selecionou ${data.number_choosed.length}`
    }

  }

  public async show({ params }: HttpContextContract) {
    const bet = await Bet.findOrFail(params.id)
    return bet
  }

  public async update({ params, request }: HttpContextContract) {
    const data = await request.only(['user_id', 'game_id', 'bet'])
    const bet = await Bet.findOrFail(params.id)

    bet.merge(data)

    await bet.save()

    return bet
  }

  public async destroy({ params }: HttpContextContract) {
    const bet = await Bet.findOrFail(params.id)
    bet.delete()

    return {deleted: true}
  }

  public async myBets({ auth }: HttpContextContract){
    const user = await User.findOrFail(auth.user?.id)
    const bets = await Bet.query().where('user_id', user.id)
    return bets
  }

  public async compareListas(lista1, lista2){
    for (var i = 0, len = lista2.length; i < len; i++){
      if (lista1[i] !== lista2[i]){
        return false;
      }
    }
    return true;
  }
}
