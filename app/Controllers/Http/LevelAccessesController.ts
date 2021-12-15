import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LevelAccess from 'App/Models/LevelAccess'

export default class LevelAccessesController {
  public async index({}: HttpContextContract) {
    const level = await LevelAccess.all()

    return {level_access: level}
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.only(['level'])

    try{
      const level = await LevelAccess.create(data)
      return {created: true, level_access: level}
    }catch{
      return {created: false, Error: 'Error on create a new level access'}
    }
  }

  public async show({ params }: HttpContextContract) {
    try{
      const level = await LevelAccess.findOrFail(params.id)

      return {level_access: level}
    }catch{
      return {Error: 'Level_Access do not found'}
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const level = await LevelAccess.findOrFail(params.id)
    const data = await request.only(['level'])

    try{
      level.merge(data)
      await level.save()

      return {updated: true, level_access: level}
    }catch{
      return {Error: 'Error on update level_access'}
    }

  }

  public async destroy({ params }: HttpContextContract) {
    const level = await LevelAccess.findOrFail(params.id)

    try{
      level.delete()
      return {Deleted: true}
    }catch{
      return {Error: 'Error on delete access_level'}
    }
  }
}
