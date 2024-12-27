import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const updatedCart = [
            ...state.cart,
            {
              ...product,
              imageInfo: null,
              frameInfo: null,
              canvasInfo: null,
            },
          ];
          toast.success("Item added to cart");
          return { cart: updatedCart };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const updatedCart = state.cart.filter(
            (item) => item._id !== productId
          );
          toast.success("Item removed from cart");
          return { cart: updatedCart };
        }),

      updateCartItem: (productId, updatedFields) =>
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item._id === productId
              ? { ...item, ...updatedFields }
              : item
          );
          return { cart: updatedCart };
        }),
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;

          const storedData = localStorage.getItem(name);

          if (!storedData) {
            const cart = localStorage.getItem("cart");

            return {
              cart: cart ? JSON.parse(cart) : [],
            };
          }

          return JSON.parse(storedData);
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

export default useCartStore;
