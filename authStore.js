import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isSignedIn: false,

      signin: (newToken) =>
        set({
          token: newToken,
          isSignedIn: true,
        }),

      setUser: (newUser) =>
        set({
          user: newUser,
        }),

      signout: () =>
        set({
          token: null,
          user: null,
          isSignedIn: false,
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

            return {
              token: token || null,
              user: user ? JSON.parse(user) : null,
              isSignedIn: !!token,
            };
          }

          return JSON.parse(storedData);
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(name);
          }
        },
      },
    }
  )
);

export default useAuthStore;
