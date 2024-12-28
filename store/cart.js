import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addItemToCart: (item, options) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem._id === item._id
        );

        if (item && options) {
          item = { ...item, ...options };
        }

        if (itemExists) {
          const updatedCartItems = get().cartItems.map((cartItem) =>
            cartItem._id === item._id ? { ...cartItem, ...item } : cartItem
          );
          set({ cartItems: updatedCartItems });
        } else {
          set({ cartItems: [...get().cartItems, { ...item }] });
        }
      },

      increaseQuantity: (productId) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem._id === productId
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            itemExists.quantity++;
          }

          set({ cartItems: [...get().cartItems] });
        }
      },

      decreaseQuantity: (productId) => {
        const itemExists = get().cartItems.find(
          (cartItem) => cartItem._id === productId
        );

        if (itemExists) {
          if (typeof itemExists.quantity === "number") {
            if (itemExists.quantity === 1) {
              const updatedCartItems = get().cartItems.filter(
                (item) => item._id !== productId
              );
              set({ cartItems: updatedCartItems });
            } else {
              itemExists.quantity--;
              set({ cartItems: [...get().cartItems] });
            }
          }
        }
      },

      removeItemFromCart: (productId) => {
        const updatedCartItems = get().cartItems.filter(
          (item) => item._id !== productId
        );
        set({ cartItems: updatedCartItems });
      },

      isItemInCart: (productId) => {
        return get().cartItems.some((cartItem) => cartItem._id === productId);
      },
    }),
    {
      name: "cart-items",
    }
  )
);

export default useCartStore;
