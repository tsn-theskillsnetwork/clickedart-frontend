"use client";

import {
  MessageSquare,
  Search,
  ShoppingCart,
  User2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [scrollLocation, setScrollLocation] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const menuItems = [
    { name: "Home", url: "/" },
    { name: "Themes", url: "/themes" },
    { name: "Featured Artists", url: "/featured-artists" },
    { name: "Membership", url: "/membership" },
    { name: "About", url: "/about" },
    // { name: "More", url: "/more" },
  ];

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollLocation(window.scrollY);
    });

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`fixed flex flex-row items-center justify-between px-6 gap-5 sm:px-10 ${
        scrollLocation > 50 || pathname !== "/"
          ? "bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] "
          : "bg-transparent shadow-none"
      } h-20 sm:h-24 z-50 w-full`}
    >
      <div className="hidden sm:block">
        {scrollLocation > 50 || pathname !== "/" ? (
          <Image
            src="/assets/Logo.png"
            className="h-full w-full"
            alt="logo"
            width={200}
            height={50}
          />
        ) : (
          <Image
            src="/assets/LogoWhite.png"
            className="h-full w-full"
            alt="logo"
            width={200}
            height={50}
          />
        )}
      </div>
      <div className="sm:hidden mt-[5%] w-full flex flex-row gap-2 items-center justify-around">
        <button
          className={`border ${
            scrollLocation > 50 || pathname !== "/"
              ? "text-black border-black"
              : "text-white border-white"
          } rounded-lg px-1 py-2  w-32 group`}
        >
          <p className="text-xs">Browse collections</p>
        </button>
        <button
          className={`border ${
            scrollLocation > 50 || pathname !== "/"
              ? "text-black border-black"
              : "text-white border-white"
          } rounded-lg px-1 py-2  w-28 group`}
        >
          {" "}
          <p className="text-xs">Sell your photos</p>
        </button>
      </div>
      <div className="sm:hidden pt-3">
        <Menu
          ref={menuButtonRef}
          size={30}
          className={`${
            scrollLocation > 50 || pathname !== "/"
              ? "text-surface-600"
              : "text-white"
          } cursor-pointer`}
          onClick={toggleMenu}
        />
      </div>

      <div className="hidden sm:flex flex-row gap-0">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.url}>
            <p
              className={`text-sm md:text-md lg:text-lg xl:text-cl menuHover px-1 xl:px-4 py-2 rounded-lg text-center font-semibold ${
                scrollLocation > 50 || pathname !== "/"
                  ? "text-surface-600"
                  : "text-white"
              } cursor-pointer ${
                item.url === "/"
                  ? pathname === item.url
                    ? "menuActive"
                    : ""
                  : pathname.startsWith(item.url)
                  ? "menuActive"
                  : ""
              }`}
            >
              {item.name}
            </p>
          </Link>
        ))}
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-0 left-0 right-0 bg-white shadow-lg p-6 sm:hidden flex flex-col gap-4"
        >
          <div className="flex justify-end">
            <X
              size={30}
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>

          {menuItems.map((item, index) => (
            <Link key={index} href={item.url}>
              <p className="text-lg font-semibold text-black cursor-pointer">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="hidden sm:flex flex-row gap-2 xl:gap-10">
        <MessageSquare
          className={`${
            scrollLocation > 50 || pathname !== "/"
              ? "text-surface-600"
              : "text-white"
          } cursor-pointer`}
        />
        <Search
          className={`${
            scrollLocation > 50 || pathname !== "/"
              ? "text-surface-600"
              : "text-white"
          } cursor-pointer`}
        />
        <User2
          className={`${
            scrollLocation > 50 || pathname !== "/"
              ? "text-surface-600"
              : "text-white"
          } cursor-pointer`}
        />
        <ShoppingCart
          className={`${
            scrollLocation > 50 || pathname !== "/"
              ? "text-surface-600"
              : "text-white"
          } cursor-pointer`}
        />
      </div>
    </div>
  );
}
