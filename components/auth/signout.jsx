import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

export default function Signout() {
  const router = useRouter();
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/signin");
  };
  return (
    <div>
      <Button variant="destructive" onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  );
}
