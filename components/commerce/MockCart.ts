import { Products } from "@/utils/products";

export const mockCartItems = Products.slice(0, 3).map((product, index) => ({
  product,
  quantity: index + 1,
}));

export const cartSubtotal = mockCartItems.reduce(
  (total, item) => total + item.product.price * item.quantity,
  0,
);

export const shipping = 18;
export const tax = Math.round(cartSubtotal * 0.08);
export const orderTotal = cartSubtotal + shipping + tax;
