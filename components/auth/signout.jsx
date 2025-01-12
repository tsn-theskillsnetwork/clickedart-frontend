import { useRouter } from "next/navigation";
import React from "react";
import useAuthStore from "@/authStore";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Signout({ variant = "icon" }) {
  const router = useRouter();
  const signout = useAuthStore((state) => state.signout);

  const handleLogout = () => {
    signout();
    toast.success("Logged out successfully");
    router.push("/");
  };
  return (
    <div>
      <p onClick={handleLogout}>
        {variant === "icon" && (
          <LogOut className="text-red-500 cursor-pointer" size={24} />
        )}
        {variant === "text" && (
          <p className="text-lg font-semibold text-red-600 cursor-pointer">
            Sign out
          </p>
        )}
        {}
      </p>
    </div>
  );
}
