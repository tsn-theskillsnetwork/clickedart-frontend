import React, { Suspense } from "react";
import Loader from "@/components/loader";
import ThemesResultPage from "./themes-result";

export const metadata = {
  title: "Images - ClickedArt",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  description:
    "Explore the world of photography with ClickedArt. Discover the best images from photographers around the world.",
  openGraph: {
    title: "Images - ClickedArt",
    description:
      "Explore the world of photography with ClickedArt. Discover the best images from photographers around the world.",
  },
};

export default function VerifyPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      }
    >
      <ThemesResultPage />
    </Suspense>
  );
}
