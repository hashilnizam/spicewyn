import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - SpiceWyn</title>
        </Helmet>
        <div className="container-custom py-12 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start adding some delicious spices!</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({items.length}) - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product._id}-${item.variant}`} className="card p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.images[0]?.url || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.variant && `Variant: ${item.variant}`}
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-2">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product._id, item.variant)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.variant)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.variant)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    🎉 You've qualified for free shipping!
                  </p>
                )}
                {subtotal < 500 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add {formatCurrency(500 - subtotal)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>

              <Link to="/products" className="block mt-3">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
