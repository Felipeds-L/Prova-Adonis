import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const game = await Game.all();

    return {games: game};
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])

   try{
    const game = await Game.create(data);
    return {created_game: game}

   }catch{
     return {error: 'Error on create a new game'}
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

  public async update({ params, request}: HttpContextContract) {
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
  }

  public async destroy({ params }: HttpContextContract) {

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
