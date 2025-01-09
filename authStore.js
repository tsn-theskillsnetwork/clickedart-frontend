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
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;

          const storedData = sessionStorage.getItem(name);

          if (!storedData) {
            const token = sessionStorage.getItem("token");
            const user = sessionStorage.getItem("user");

            return JSON.stringify({
              token: token || null,
              user: user ? JSON.parse(user) : null,
            });
          }

          return storedData;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(name, value);
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(name);
          }
        },
      },
      onRehydrateStorage: () => (state) => {
        // Set the `isHydrated` flag after rehydration
        state.isHydrated = true;
      },
    }
  )
);

export default useAuthStore;
