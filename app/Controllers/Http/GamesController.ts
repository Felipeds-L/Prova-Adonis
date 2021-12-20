import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import User from 'App/Models/User';
import UserLevelAccess from 'App/Models/UserLevelAccess';

export default class GamesController {
  public async index({}: HttpContextContract) {
    const game = await Game.all();

    return {games: game};
  }

  public async store({ request, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      const data = await request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])

      try{
        const game = await Game.create(data);
        return {created_game: game}

      }catch{
        return {error: 'Error on create a new game'}
      }
    }else{
      return {Error: 'you can not create a game'}
    }

  }

  public async show({ params }: HttpContextContract) {

    try{
      const game = await Game.findOrFail(params.id)
      return {game: game}
    }catch{
      return {error: 'Game do not found'}
    }
  }

  public async update({ params, request, auth}: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)
    if(user_level.level_access_id === 1){
      try{
        const data = await request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
        const game = await Game.findOrFail(params.id)
        try{
          game.merge(data)
          await game.save()
          return {game: game}
        }catch{
          return {Error: `Error on update game ${game.id}`}
        }
      }catch{
        return {Error: 'Game not found, or column invalid'}
      }
    }else{
      return {Error: `You don't have permission to change a game, ask for the administrator.`}
    }
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)
    if(user_level.level_access_id === 1){
      try{
        const game = await Game.findOrFail(params.id)
        try{
          game.delete()
          return {deleted: true}
        }catch{
          return {Error: 'Error on delete game'}
        }
      }catch{
        return {error: 'Game do not found'}
      }
    }

  }
}
