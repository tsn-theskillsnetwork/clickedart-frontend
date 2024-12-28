import axios from "axios";
import { create } from "zustand";

const useWishlistStore = create((set) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/get-my-wishlist?userId=${userId}`
      );
      set({ wishlist: response.data?.wishlist?.images, loading: false });
    } catch (error) {
      set({ error: error.response.message, loading: false });
    }
  },
}));

export default useWishlistStore;
