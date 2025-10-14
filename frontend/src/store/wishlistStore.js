import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: async (product) => {
        const items = get().items;
        
        if (items.find((item) => item._id === product._id)) {
          toast.error('Already in wishlist');
          return;
        }

        try {
          // If user is logged in, sync with backend
          const token = localStorage.getItem('token');
          if (token) {
            await axios.post(`/wishlist/${product._id}`);
          }
          
          set({ items: [...items, product] });
          toast.success('Added to wishlist');
        } catch (error) {
          toast.error('Failed to add to wishlist');
        }
      },

      removeFromWishlist: async (productId) => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.delete(`/wishlist/${productId}`);
          }
          
          set({
            items: get().items.filter((item) => item._id !== productId),
          });
          toast.success('Removed from wishlist');
        } catch (error) {
          toast.error('Failed to remove from wishlist');
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      syncWishlist: async () => {
        try {
          const response = await axios.get('/wishlist');
          set({ items: response.data.data });
        } catch (error) {
          console.error('Failed to sync wishlist:', error);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
