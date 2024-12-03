import Footer from "@/components/Footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";

//import font

export const metadata = {
  title: "ClickedArt",
  description:
    "ClickedArt is a platform for photographers to showcase their work.",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap",
    },
  ],
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased overflow-x-hidden`}>
        <Toaster />
        {/* <NavbarMobile /> */}
        <Navbar />
        <div className="pt-24 sm:pt-28">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
