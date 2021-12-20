import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
const nodemailer = require('nodemailer');
import User from 'App/Models/User';
import Bet from 'App/Models/Bet';
import UserLevelAccess from 'App/Models/UserLevelAccess';

export default class UsersController{
  public async index({}: HttpContextContract) {
    const user = await User.all()

    return user
  }

  public async store({request}: HttpContextContract) {


    const data = await request.only(['email', 'username', 'password'])
    const user = await User.create(data)
    const user_level_data = request.only(['level_access'])
    const user_level = await UserLevelAccess.create({
      user_id: user.id,
      level_access_id: user_level_data.level_access
    })

    this.congratSingIn(user.id)

    return {user: user, level_access: user_level}
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    let lastWeek = (24*60*60*1000)*30
    let currentDate = new Date()
    let lastWeekDate = new Date()
    lastWeekDate.setTime(lastWeekDate.getTime()-lastWeek)

    const bets = await Bet.query().where('user_id', user.id).whereBetween('created_at', [lastWeekDate, currentDate])

    return {User: user, Bets: bets}
  }

  public async update({ request, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
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

  public async myBets({ auth }: HttpContextContract){
    const user = await User.findOrFail(auth.user?.id)
    const bets = await Bet.query().where('user_id', user.id)
    return {User: user, Bets: bets}
  }

  public async forgotPassword({ auth, response }: HttpContextContract){
    const user = await User.findOrFail(auth.user?.id)
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
      subject: "Recuperação de Senha",
      text: `Prezado(a) ${user.username}. \n\n segue abaixo informações para que possa recuperar sua senha. \n\n`,
      html: `<p>Prezado(a) ${user.username}.<br><br> segue abaixo informações para que possa recuperar sua senha.<br><br></p>`
    };

    transport.sendMail(message, function(err) {
      if(err){
        return response.status(400).json({
          erro: true,
          message: "Email can't bee sent"
        })
      }
    })

    return response.send({
      error: false,
      message: 'Email sent correctly'
    })
  }

  public async congratSingIn(user_id){
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
      subject: "Sua conta foi criada!",
      text: `Prezado(a) ${user.username}. \n\n, seja muito bem vindo, sua conta foi criada com sucesso!. \n\n`,
      html: `<p>Prezado(a) ${user.username}. \n\n, seja muito bem vindo, sua conta foi criada com sucesso!.<br><br></p>`
    };

    transport.sendMail(message)
  }


}
