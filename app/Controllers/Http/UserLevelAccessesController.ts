import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess'

export default class UserLevelAccessesController {
  public async index({}: HttpContextContract) {
    const user_level = await UserLevelAccess.all()

    return {user_level_access: user_level}
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.only(['user_id', 'level_access_id'])
    const user = await User.findOrFail(auth.user?.id)

    try{
      const user_level = await UserLevelAccess.create({
        user_id: user.id,
        level_access_id: data.level_access_id
      })

      return {created: true, user_level_access: user_level}
    }catch{
      return {Error: `Error on add a level_access to user ${user.id}`}
    }
  }

  public async show({ params }: HttpContextContract) {
    try{
      const user_level = await UserLevelAccess.findOrFail(params.id)
      return {user_level_access: user_level}
    }catch{
      return {Error: 'Error user_level_access not found'}
    }


  }

  public async update({ params, request }: HttpContextContract) {
    const user_level = await UserLevelAccess.findOrFail(params.id)
    const data = await request.only(['user_id', 'level_access_id'])

    try{
      user_level.merge(data)
      await user_level.save()

      return {Updated: true, user_level: user_level}
    }catch{
      return {Error: 'Error on try update'}
    }
  }

  public async destroy({ params }: HttpContextContract) {
    try{
      const user_level = await UserLevelAccess.findOrFail(params.id)
      user_level.delete()

      return {Deleted: true}
    }catch{
      return {Error: 'Error on delete user_level'}
    }
  }
}
