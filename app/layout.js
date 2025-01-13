import Footer from "@/components/footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";

//import font

export const metadata = {
  title: "ClickedArt",
  description:
    "ClickedArt is a platform for photographers to showcase their work.",
  // link: [
  //   {
  //     rel: "stylesheet",
  //     href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap",
  //   },
  // ],
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body className={`antialiased overflow-x-hidden`}>
        <Toaster />
        {/* <NavbarMobile /> */}
        <Navbar />
        <div className="pt-20 sm:pt-24">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
