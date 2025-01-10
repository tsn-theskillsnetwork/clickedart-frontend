import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      photographer: null,
      isHydrated: false, // Flag for hydration status

      signin: (newToken) =>
        set({
          token: newToken,
        }),

      setUser: (newUser) =>
        set({
          user: newUser,
        }),

      setPhotographer: (newPhotographer) =>
        set({
          photographer: newPhotographer,
        }),

      signout: () =>
        set({
          token: null,
          user: null,
          photographer: null,
        }),
    }),
    {
      name: "auth-storage", // The key for sessionStorage
      storage: {
        getItem: (key) => {
          if (typeof window === "undefined") return null; // Ensure this only runs in the browser
          const storedData = sessionStorage.getItem(key);
          return storedData ? JSON.parse(storedData) : null;
        },
        setItem: (key, value) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(key, JSON.stringify(value));
          }
        },
        removeItem: (key) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(key);
          }
        },
      },
      onRehydrateStorage: () => (state) => {
        // Set the `isHydrated` flag to true after hydration
        state.isHydrated = true;
      },
    }
  )
);

export default useAuthStore;
