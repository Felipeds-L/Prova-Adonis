import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess'

export default class CartsController {
  public async index({}: HttpContextContract) {
    const cart = await Cart.all()

    return {cart: cart}
  }
  // Essa função deve na realidade, criar se não existir, e editar o valor caso já exista um min_cart_value cadastrado
  public async store({ request, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    const cart = await Cart.all();
    const data = await request.only(['min_cart_value'])
    if(user_level.level_access_id === 1){
      try{
        if(cart.length > 0){
          return {Error: "There's already a cart in table, please update de value"}
        }else{
          const cartData = await Cart.create(data)

          return {Created: true, cart: cartData}
        }
      }catch{
        return {Error: 'Error on try create a cart'}
      }
    }else{
      return {Error: `you don't have permission to define a min-cart-value.`}
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

  public async update({ params, request, auth }: HttpContextContract) {
    const cart = await Cart.findOrFail(params.id)
    const data = await request.only(['min_cart_value'])

    const user = await User.findOrFail(auth.user?.id)
    const user_level = await UserLevelAccess.findByOrFail('user_id', user.id)

    if(user_level.level_access_id === 1){
      try{
        cart.merge(data)
        await cart.save()

        return {Updated: true, Cart: cart}
      }catch{
        return {Updated: false, Error: 'Erro on update cart'}
      }
    }else{
      return {Error: `you don't have permission to define a min-cart-value.`}
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
