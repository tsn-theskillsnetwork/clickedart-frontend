import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import useAuthStore from "@/authStore";
import { LogOut } from "lucide-react";

export default function Signout() {
  const router = useRouter();
  const signout = useAuthStore((state) => state.signout);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    signout(); // Clear Zustand state
    router.push("/"); // Redirect to home page
  };
  return (
    <div>
      {/* <Button variant="destructive" onClick={handleLogout}>
        Sign Out
      </Button> */}
      <LogOut onClick={handleLogout} className="text-red-500 cursor-pointer" size={24} />
    </div>
  );
}
