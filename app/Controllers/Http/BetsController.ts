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
    const data = await request.only(['user_id','game_id', 'bet'])
    const game = await Game.findOrFail(data.game_id)
    const user = await User.findOrFail(auth.user?.id)

    if(game.max_number === data.bet.length){
      const bet = await Bet.create({
        user_id: user.id,
        game_id: data.game_id,
        bet: data.bet
      })
      return {bet: bet}
    }else{
      return `Error: você deve selecionar ${game.max_number} números, nesse jogo. Você selecionou ${data.bet.length}`
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
    const bet = await Bet.findBy('user_id', auth.user?.id)
    return bet
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
