import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
const nodemailer = require('nodemailer');

import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess';
import Game from 'App/Models/Game';

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
    const data = await request.only(['game_id', 'numbers_choosed'])
    const game = await Game.findOrFail(data.game_id)
    const user = await User.findOrFail(auth.user?.id)

    const numbers: string = data.numbers_choosed;
    let values = numbers.split(',')


    let isBetAlreadyMade = false

    let lastWeek = (24*60*60*1000)*30
    let currentDate = new Date()
    let lastWeekDate = new Date()
    lastWeekDate.setTime(lastWeekDate.getTime()-lastWeek)

    let listNonDuplicated = [...new Set(values)]

    if(listNonDuplicated.length === game.max_number){
      // Return all the bets to the game choosed, from the current user in the last 30 days
      const betsFromUser = await Bet.query().where('user_id', user.id).where('game_id', data.game_id).whereBetween('created_at', [lastWeekDate, currentDate])

      betsFromUser.forEach((bets) => {
        let bet_numbers:string = bets.numbers_choosed;
        let bet_value = bet_numbers.split(',')
        if(this.compareListas(values.sort(), bet_value.sort())){
          isBetAlreadyMade = true
        }else{
          isBetAlreadyMade = false
        }
      })

      if(!isBetAlreadyMade){
        try{
          const bet = await Bet.create({
            user_id: user.id,
            game_id: data.game_id,
            numbers_choosed: data.numbers_choosed
          })
          this.newBet(user.id)
          return {created: true, bet: bet}
        }catch{
          return {Error: 'Can not make the bet, please try it again!'}
        }
      }else{
        return {Error: 'You already have been made a bet in the last 30 days for this game with the same numbers, please choose another combination!'}
      }
    }else if(listNonDuplicated.length < values.length){
      return {Error: 'There is a duplicated value on the bet your trying to do, please check it and try it again!'}
    }else{
      return {Error: `You only can choose ${ game.max_number} numbers, you are choosing ${listNonDuplicated.length}`}
    }

  }

  public async show({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const bet = await Bet.findOrFail(params.id)
    if(user.id === bet.user_id){
      console.log(bet.numbers_choosed)
      return {Bet: bet}
    }else{
      return {Error: 'Your are trying access a bet whos the owner is not you.'}
    }
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.only(['user_id', 'game_id', 'numbers_choosed'])
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

  public compareListas(lista1, lista2){
    if (lista1.length !== lista2.length) return false;
    for (var i = 0, len = lista2.length; i < len; i++){
        if (lista1[i] !== lista2[i]){
            return false;
        }
    }
    return true;
  }

  public compareValues(lista){
    for(let i = 0; i < lista.length; i++) {
        if(lista.indexOf(lista[i]) != i) {
            return true;
        };
    }
    return false;
  }
}
