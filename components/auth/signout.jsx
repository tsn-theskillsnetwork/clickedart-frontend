import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import useAuthStore from "@/authStore";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Signout() {
  const router = useRouter();
  const signout = useAuthStore((state) => state.signout);

  const handleLogout = () => {
    signout();
    toast.success("Logged out successfully");
    router.push("/");
  };
  return (
    <div>
      <LogOut
        onClick={handleLogout}
        className="text-red-500 cursor-pointer"
        size={24}
      />
    </div>
  );
}
