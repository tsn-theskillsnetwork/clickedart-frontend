// import { create } from "zustand";

// const useAuthStore = create((set, get) => ({
//   token: typeof window !== "undefined" ? sessionStorage.getItem("token") : null,
//   user: null,
//   photographer: null,
//   userType: null, // "User" or "Photographer"
//   isHydrated: false, // Track hydration state

//   signin: (newToken) => {
//     sessionStorage.setItem("token", newToken);
//     set({ token: newToken });
//     get().fetchUserProfile(); // Fetch user after login
//   },

//   setUserType: (type) => set({ userType: type }),

//   fetchUserProfile: async () => {
//     const token = get().token;
//     if (!token) {
//       set({ isHydrated: true }); // Mark as hydrated even if no token
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER}/api/user/get-user-profile-by-token`,
//         {
//           headers: { "x-auth-token": token },
//         }
//       );

//       if (res.ok) {
//         const data = await res.json();
//         const userType = data.user?.type;
//         set({ userType });

//         if (userType === "User") {
//           set({ user: data.user, photographer: null });
//         } else {
//           set({ photographer: data.user, user: null });
//         }
//       } else {
//         get().signout();
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       get().signout();
//     } finally {
//       set({ isHydrated: true }); // Ensure hydration state is updated
//     }
//   },

//   signout: () => {
//     sessionStorage.removeItem("token");
//     set({ token: null, user: null, photographer: null, userType: null });
//   },
// }));

// // Auto-fetch user profile on store initialization
// useAuthStore.getState().fetchUserProfile();

// export default useAuthStore;


import { create } from "zustand";
import Cookies from "js-cookie";

const useAuthStore = create((set, get) => ({
  token: typeof window !== "undefined" ? Cookies.get("token") : null,
  user: null,
  photographer: null,
  userType: null,
  isHydrated: false, // Maintain hydration 

  signin: (newToken) => {
    Cookies.set("token", newToken, { expires: 7, secure: true }); // Store token in a cookie
    set({ token: newToken });
    get().fetchUserProfile(); // Auto-fetch
  },

  setUserType: (type) => set({ userType: type }),

  fetchUserProfile: async () => {
    const token = get().token || Cookies.get("token");
    if (!token) {
      set({ isHydrated: true });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/user/get-user-profile-by-token`, {
        headers: { "x-auth-token": token },
      });

      if (res.ok) {
        const data = await res.json();
        const userType = data.user?.type;
        set({ userType });

        if (userType === "User") {
          set({ user: data.user, photographer: null });
        } else {
          set({ photographer: data.user, user: null });
        }
      } else {
        get().signout();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      get().signout();
    } finally {
      set({ isHydrated: true });
    }
  },

  signout: () => {
    Cookies.remove("token");
    set({ token: null, user: null, photographer: null, userType: null, isHydrated: true });
  },
}));

// Auto-fetch on initialization
useAuthStore.getState().fetchUserProfile();

export default useAuthStore;
