import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
const nodemailer = require('nodemailer')
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

  public async sendMail({ auth, response }: HttpContextContract){
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

}
