import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
const nodemailer = require('nodemailer');
import User from 'App/Models/User';
import Bet from 'App/Models/Bet';
import UserLevelAccess from 'App/Models/UserLevelAccess';
import EmailValidator from 'App/Validators/EmailValidator';
import UserNameValidator from 'App/Validators/UserNameValidator';

export default class UsersController{
  public async index({ auth }: HttpContextContract) {
    const user = await User.all()
    const logged = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.query().where('user_id', logged.id)

    let isAdministrator = false
    user_level.forEach((level) => {
      if(level.level_access_id === 1){
        isAdministrator = true
      }
    })

    if(isAdministrator){
      try{
        return {User: user}
      }catch{
        return {Error: `Problem on trying bring all users, please try again!`}
      }
    }else{
      return {Error: `Only Administrators can see all user information`}
    }
  }

  public async store({request}: HttpContextContract) {

    await request.validate(EmailValidator)
    await request.validate(UserNameValidator)

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

  public async show({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const logged = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.query().where('user_id', logged.id)

    let isAdministrator = false
    user_level.forEach((level) => {
      if(level.level_access_id === 1){
        isAdministrator = true
      }
    })

    if(isAdministrator){
      try{
        let lastWeek = (24*60*60*1000)*30
        let currentDate = new Date()
        let lastWeekDate = new Date()
        lastWeekDate.setTime(lastWeekDate.getTime()-lastWeek)

        const bets = await Bet.query().where('user_id', user.id).whereBetween('created_at', [lastWeekDate, currentDate])

        return {User: user, Bets: bets}
      }catch{
        return {Error: `Wasn't possible bring the user information, please try again!`}
      }
    }else{
      return {Error: `Only Administrators can see another user information`}
    }

  }

  public async update({ request, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const data = request.only(['email', 'username', 'password'])
    await request.validate(UserNameValidator)
    await request.validate(EmailValidator)


    try{
      user.merge(data)
      await user.save()
      return {updated: user}
    }catch{
      return {Error: "Error to update user datas"}
    }

  }

  public async destroy({ auth}: HttpContextContract) {
    const userLogged = await User.findOrFail(auth.user?.id)


    try{
      userLogged.delete()
      return { Deleted: true}
    }catch{
      return {Error: 'Error on delete user'}
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
