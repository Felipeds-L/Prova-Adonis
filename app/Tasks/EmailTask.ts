import { BaseTask } from 'adonis5-scheduler/build'
import User from 'App/Models/User'
import Bet from 'App/Models/Bet'
const nodemailer = require('nodemailer');


export default class EmailTask extends BaseTask {
	public static get schedule() {

		return '40 * * * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
    const user = await User.all()
    user.forEach((user) => {

      // await console.log(this.diferenceBetweenDates(user.id))
      // const bets = Bet.findByOrFail('user_id', user.id)
      // console.log(bets)
      // const now = new Date();
      console.log('days:' + user.createdAt)
    })
    // this.logger.info('Handled')
  }

  public async sendMail(){
    const users = await User.all()
    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "583128b8852a7b",
        pass: "495b0a35ecc53b"
      }
    });

    users.forEach((user) =>{
      let message = {
        from: "noreply@milk.com",
        to: user.email,
        subject: "Recuperação de Senha",
        text: `Prezado(a) ${user.username}. \n\n segue abaixo informações para que possa recuperar sua senha. \n\n`,
        html: `<p>Prezado(a) ${user.username}.<br><br> segue abaixo informações para que possa recuperar sua senha.<br><br></p>`
      };

      transport.sendMail(message, function(err) {
        if(err){
          return {
            erro: true,
            message: "Email can't bee sent"
          }
        }
      })

      return {
        error: false,
        message: 'Email sent correctly'
      }
    })
  }



  public async diferenceBetweenDates(user_id){
    const bets = await Bet.query().where('user_id', user_id)

    const betDay = new Date(`${bets[bets.length-1]}`)
    const now = new Date();

    let diference = Math.abs(now.getTime() - betDay.getTime())
    const days = Math.ceil(diference / (1000 * 60 * 60 * 24))

    return days
  }
}
