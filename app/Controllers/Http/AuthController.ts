import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmailValidator from 'App/Validators/EmailValidator'


export default class AuthController {

  public async login({ auth, request, response }: HttpContextContract){
    await request.validate(EmailValidator)

    const email = request.input('email')
    const password = request.input('password')
    try{
      const token = await auth.use('api').attempt(email, password)
      return token
    }catch{
      return response.badRequest('Invalid credential')
    }
  }
}
