"use client";

import React from "react";
import useAuthStore from "@/authStore";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "@/store/cart";

export default function Signout({ variant = "icon" }) {
  const { clearCart } = useCartStore();
  const signout = useAuthStore((state) => state.signout);

  const handleLogout = () => {
    signout();
    toast.success("Logged out successfully");
    clearCart();
    setTimeout(() => {
      window.location.reload();
    }, 100); 
  };

  return (
    <div>
      <div onClick={handleLogout}>
        {variant === "icon" && (
          <LogOut className="text-red-500 cursor-pointer" size={24} />
        )}
        {variant === "text" && (
          <p className="text-lg font-semibold text-red-600 cursor-pointer">
            Sign out
          </p>
        )}
        {}
      </div>
    </div>
  );
}
