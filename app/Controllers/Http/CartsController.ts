import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'

export default class CartsController {
  public async index({}: HttpContextContract) {
    const cart = await Cart.all()

    return {cart: cart}
  }
  // Essa função deve na realidade, criar se não existir, e editar o valor caso já exista um min_cart_value cadastrado
  public async store({ request }: HttpContextContract) {
    const data = await request.only(['min_cart_value'])
    try{
      const cart = await Cart.create(data)

      return {Created: true, cart: cart}
    }catch{
      return {Error: 'Error on try create a cart'}
    }
  }

  public async show({ params }: HttpContextContract) {
    try{
      const cart = await Cart.findOrFail(params.id)
      return {Cart: cart}
    }catch{
      return {Error: 'Error cart do not found'}
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const cart = await Cart.findOrFail(params.id)
    const data = await request.only(['min_cart_value'])

    try{
      cart.merge(data)
      await cart.save()

      return {Updated: true, Cart: cart}
    }catch{
      return {Updated: false, Error: 'Erro on update cart'}
    }
  }

  public async destroy({ params }: HttpContextContract) {
    try{
      const cart = await Cart.findOrFail(params.id)
      cart.delete()

      return {Deleted: true}
    }catch{
      return {Deleted: false, Error: 'Erron on try delete the cart'}
    }
  }
}
