import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      deriveMode: (item) => (item.paperInfo ? "print" : "digital"),

      // Add item to cart
      addItemToCart: (item, options = {}) => {
        const newItem = { ...item, ...options };
        const newItemMode = get().deriveMode(newItem);

        // Check if an identical item with the same mode already exists
        const itemExists = get().cartItems.find(
          (cartItem) =>
            cartItem._id === newItem._id &&
            get().deriveMode(cartItem) === newItemMode
        );

        if (itemExists) {
          // Update the existing item
          const updatedCartItems = get().cartItems.map((cartItem) =>
            cartItem._id === newItem._id &&
            get().deriveMode(cartItem) === newItemMode
              ? { ...cartItem, ...newItem }
              : cartItem
          );
          set({ cartItems: updatedCartItems });
        } else {
          // Add new item with the derived mode
          set({ cartItems: [...get().cartItems, newItem] });
        }
      },

      // Remove item from cart
      removeItemFromCart: (productId, mode) => {
        const updatedCartItems = get().cartItems.filter(
          (cartItem) =>
            !(cartItem._id === productId && get().deriveMode(cartItem) === mode)
        );
        set({ cartItems: updatedCartItems });
      },

      // Check if an item exists in the cart with a specific mode
      isItemInCart: (productId, mode) => {
        const cartItems = get().cartItems;
        const exists = cartItems.some((cartItem) => {
          const derivedMode = get().deriveMode(cartItem);
          return cartItem._id === productId && derivedMode === mode;
        });
        return exists;
      },

      // Calculate total amounts
      calculateTotals: () => {
        const cartItems = get().cartItems;

        const subTotal = cartItems.reduce(
          (sum, item) => sum + (item.subTotal || item.price || 0),
          0
        );

        const totalAmount = subTotal;
        const finalAmount = totalAmount;

        return { subTotal, totalAmount, finalAmount };
      },

      // Clear the cart
      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-items",
    }
  )
);

export default useCartStore;
