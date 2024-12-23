import { create } from "zustand";
import useAuthStore from "./authStore";

const useWishlistStore = create((set) => ({
  wishlist: [],
  loading: false,
  error: null,

  // Fetch wishlist from the backend
  fetchWishlist: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/get-my-wishlist?userId=${userId}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      set({ wishlist: data.wishlist?.images, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useWishlistStore;
