import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
const nodemailer = require('nodemailer');

import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess';


export default class BetsController {
  public async index({ auth }: HttpContextContract) {
    const bet = await Bet.all()
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      return {Bets: bet}
    }else{
      return {Error: 'Only administrators can see all the bets!'}
    }

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
      this.newBet(user.id)
      return {bet: bet}
    }else{
      return `Error: você deve selecionar ${game.max_number} números, nesse jogo. Você selecionou ${data.number_choosed.length}`
    }

  }

  public async show({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const bet = await Bet.findOrFail(params.id)
    if(user.id === bet.user_id){
      return {Bet: bet}
    }else{
      return {Error: 'Your are trying access a bet whos the owner is not you.'}
    }
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.only(['user_id', 'game_id', 'bet'])
    const bet = await Bet.findOrFail(params.id)
    const user = await User.findOrFail(auth.user?.id)

    if(user.id === bet.user_id){
      try{
        bet.merge(data)

        await bet.save()

        return {Updated: true, Bet: bet}
      }catch{
        return {Error: 'Could not update de bet. Try again.'}
      }
    }
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const bet = await Bet.findOrFail(params.id)


    if(user.id === bet.user_id){
      try{
        bet.delete()

        return {deleted: true}
      }catch{
        return {Error: `Error on delele the bet ${bet.id}. Try again.`}
      }
    }else{
      return {Error: `Your not the owner of this bet`}
    }

  }

  public async newBet(user_id){
    const user = await User.findOrFail(user_id)
    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "583128b8852a7b",
        pass: "495b0a35ecc53b"
      }
    });

    let message = {
      from: "noreply@milk.com",
      to: user.email,
      subject: "Aposta realizada!",
      text: `Prezado(a) ${user.username}. \n\n, sua aposta foi realizada com sucesso!. \n\n`,
      html: `<p>Prezado(a) ${user.username}. \n\n, sua aposta foi realizada com sucesso!<br><br></p>`
    }

    transport.sendMail(message)
  }
}
