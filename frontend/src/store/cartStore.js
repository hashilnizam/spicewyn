import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1, variant = null) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => item.product._id === product._id && item.variant === variant
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
          toast.success('Cart updated');
        } else {
          set({
            items: [...items, { product, quantity, variant }],
          });
          toast.success('Added to cart');
        }
      },

      removeFromCart: (productId, variant = null) => {
        set({
          items: get().items.filter(
            (item) => !(item.product._id === productId && item.variant === variant)
          ),
        });
        toast.success('Removed from cart');
      },

      updateQuantity: (productId, quantity, variant = null) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variant);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product._id === productId && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getCartItems: () => {
        return get().items;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
