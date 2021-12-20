import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess'

export default class UserLevelAccessesController {
  public async index({auth}: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_logged_level = await UserLevelAccess.findByOrFail('user_id', user.id)
    if(user_logged_level.user_id === 1){
      const user_level = await UserLevelAccess.all()
      return {user_level_access: user_level}
    }else{
      return {Error: 'Only administrators can see all the level_access users'}
    }


  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.only(['user_id', 'level_access_id'])
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      try{
        const user_level = await UserLevelAccess.create({
          user_id: user.id,
          level_access_id: data.level_access_id
        })

        return {created: true, user_level_access: user_level}
      }catch{
        return {Error: `Error on add a level_access to user ${user.id}`}
      }
    }else{
      return {Error: 'Only adminsitrators can confere a level_access to another user!'}
    }

  }

  public async show({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findOrFail(user.id)
    if(user_level.level_access_id === 1){
      try{
        const user_level = await UserLevelAccess.findOrFail(params.id)
        return {user_level_access: user_level}
      }catch{
        return {Error: 'Error user_level_access not found'}
      }
    }else{
      return {Error: 'Only administrators can show all the users_level_access'}
    }
  }

  public async update({ request, auth }: HttpContextContract) {

    const data = await request.only(['user_id', 'level_access_id'])
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findOrFail(user.id)
    if(user_level.level_access_id === 1){
      try{
        user_level.merge(data)
        await user_level.save()

        return {Updated: true, user_level: user_level}
      }catch{
        return {Error: 'Error on try update'}
      }
    }else{
      return {Error: 'Only administrators can update a level_access to one user!'}
    }

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findOrFail(user.id)
    if(user_level.level_access_id === 1){
      try{
        const user_level = await UserLevelAccess.findOrFail(params.id)
        user_level.delete()

        return {Deleted: true}
      }catch{
        return {Error: 'Error on delete user_level'}
      }
    }else{
      return {Error: 'Only administrators can remove a level_access from another user!'}
    }
  }
}
