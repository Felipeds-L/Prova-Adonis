import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LevelAccess from 'App/Models/LevelAccess'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess'

export default class LevelAccessesController {
  public async index({auth}: HttpContextContract) {
    const level = await LevelAccess.all()
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      return {level_access: level}
    }else{
      return {Error: 'Only Administrators can see all level_access!'}
    }

  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.only(['level'])
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)
    if(user_level.level_access_id === 1){
      try{
        const level = await LevelAccess.create(data)
        return {created: true, level_access: level}
      }catch{
        return {created: false, Error: 'Error on create a new level access'}
      }
    }else{
      return {Error: 'Only Administrators can create a new access_level!'}
    }
  }

  public async show({ params }: HttpContextContract) {
    try{
      const level = await LevelAccess.findOrFail(params.id)

      return {level_access: level}
    }catch{
      return {Error: 'Level_Access do not found!'}
    }
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const level = await LevelAccess.findOrFail(params.id)
    const data = await request.only(['level'])
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      try{
        level.merge(data)
        await level.save()

        return {updated: true, level_access: level}
      }catch{
        return {Error: 'Error on update level_access'}
      }
    }else{
      return {Error: 'Only Administrators can update level_accesses!'}
    }

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const level = await LevelAccess.findOrFail(params.id)
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      try{
        level.delete()
        return {Deleted: true}
      }catch{
        return {Error: 'Error on delete access_level'}
      }
    }else{
      return {Error: 'Only Administrators can delete a level_access!'}
    }
  }
}
