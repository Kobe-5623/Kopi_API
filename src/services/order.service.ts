import { ApiError } from "../utils/ApiError.js";
import { sequelize, CartItem as CartItemModel, Product as ProductModel, CartItemAddOn as CartItemAddOnModel, AddOn as AddonModel, Order as OrderModel, OrderItem as OrderItemModel, OrderItemAddOn as OrderItemAddOnModel} from "../models/index.js";
import { addToCartInput } from "../validators/cart.validator.js";
import { newOrderInput } from "../validators/order.validator.js";


export async function getCustomerOrders(userId: string) {
  const orders = await OrderModel.findAll({ where: { customerId: userId } });
  if (orders.length === 0) throw new ApiError(404, 'No orders found', 'NO_ORDERS_FOUND');
  return orders;
}

export async function newOrder( userId: string, storeBranchId: string, input: newOrderInput ) {
  return sequelize.transaction(async (transaction) => {
    const cart = await CartItemModel.findAll({ where: { customerId: userId }, transaction });
    if (cart.length === 0) throw new ApiError( 404, "No cart items found", "NO_CART_ITEMS_FOUND" );

    const productIds = cart.map(cartItem => cartItem.productId);
    const products = await ProductModel.findAll({ where: { id: productIds }, attributes: ["id", "price"], transaction });
    if (products.length !== new Set(productIds).size) throw new ApiError( 400, "One or more products not found", "PRODUCT_NOT_FOUND" );

    const cartItemIds = cart.map(cartItem => cartItem.id);
    const cartAddons = await CartItemAddOnModel.findAll({ where: { cartItemId: cartItemIds }, attributes: ["cartItemId", "addOnId"], transaction });
    const addonIds = cartAddons.map(cartAddon => cartAddon.addOnId);
    const addons = await AddonModel.findAll({ where: { id: addonIds }, attributes: ["id", "price"], transaction });
    if (addons.length !== new Set(addonIds).size) throw new ApiError( 400, "One or more addons not found", "ADDON_NOT_FOUND" );

    const order = await OrderModel.create({
      customerId: userId,
      customerAddressId: input.customerAddressId,
      storeBranchId,
      fulfillmentType: input.fulfillmentType,
      paymentMethod: input.paymentMethod,
      paymentReference: input.paymentReference,
      notes: input.notes,
    }, { transaction });

    const orderItems = await OrderItemModel.bulkCreate(
      cart.map(cartItem => {
        const product = products.find( product => product.id === cartItem.productId );
        if (!product) throw new ApiError( 400, "Product not found", "PRODUCT_NOT_FOUND" );

        return {
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          unitPrice: product.price,
        };
    }), { transaction });

    const orderItemAddons = [];

    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i]!;
      const orderItem = orderItems[i]!;
      const itemAddons = cartAddons.filter( cartAddon => cartAddon.cartItemId === cartItem.id );

      for (const cartAddon of itemAddons) {
        const addon = addons.find( addon => addon.id === cartAddon.addOnId );
        if (!addon) throw new ApiError( 400, "Addon not found", "ADDON_NOT_FOUND" );

        orderItemAddons.push({
          orderItemId: orderItem.id,
          addOnId: addon.id,
          unitPrice: addon.price,
        });
      }
    }

    if (orderItemAddons.length > 0) await OrderItemAddOnModel.bulkCreate( orderItemAddons, { transaction } );
    await CartItemModel.destroy({ where: { customerId: userId }, transaction });
  });
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await OrderModel.findOne({ where: { id: orderId, customerId: userId, }, });
  if (!order) throw new ApiError( 404, "Order not found", "ORDER_NOT_FOUND" );

  order.status = "cancelled";

  await order.save();
}