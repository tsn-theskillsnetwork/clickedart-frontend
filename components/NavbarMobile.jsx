"use client";

import {
  MessageSquare,
  Search,
  ShoppingCart,
  User2,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function NavbarMobile() {
  const [scrollLocation, setScrollLocation] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for mobile menu
  const menuButtonRef = useRef(null); // Reference for the hamburger menu button

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollLocation(window.scrollY);
    });

    // Close menu when clicking outside of the menu
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target) // Ensure the menu button click doesn't close the menu
      ) {
        setIsMenuOpen(false); // Close the menu if clicked outside
      }
    };

    // Add event listener for clicks
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = (event) => {
    // Stop the event from propagating to prevent outside click handler from firing
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`fixed flex flex-row items-center justify-between px-6 sm:px-10 ${
        scrollLocation > 50
          ? "bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] "
          : "bg-transparent shadow-none"
      } h-20 sm:h-28 z-50 w-full`}
    >
      <div className="hidden sm:block">
        {scrollLocation > 50 ? (
          <Image src="/assets/Logo.png" alt="logo" width={200} height={50} />
        ) : (
          <Image
            src="/assets/LogoWhite.png"
            alt="logo"
            width={200}
            height={50}
          />
        )}
      </div>

      {/* Hamburger Icon */}
      <div className="sm:hidden">
        <Menu
          ref={menuButtonRef} // Reference to the hamburger button
          size={30}
          className={`${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
          onClick={toggleMenu} // Handle menu toggle
        />
      </div>

      {/* Navigation Links - Desktop */}
      <div className="hidden sm:flex flex-row gap-10">
        <p
          className={`text-heading-05 font-semibold ${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        >
          Home
        </p>
        <p
          className={`text-heading-05 font-semibold ${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        >
          Themes
        </p>
        <p
          className={`text-heading-05 font-semibold ${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        >
          Featured Artists
        </p>
        <p
          className={`text-heading-05 font-semibold ${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        >
          Membership
        </p>
        <p
          className={`text-heading-05 font-semibold ${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        >
          About
        </p>
        <p
          className={`text-heading-05 font-semibold ${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        >
          More
        </p>
      </div>

      {/* Mobile Menu - Displayed when isMenuOpen is true */}
      {isMenuOpen && (
        <div
          ref={menuRef} // Attach ref to the menu
          className="absolute top-0 left-0 right-0 bg-white shadow-lg p-6 sm:hidden flex flex-col gap-4"
        >
          {/* Close Button */}
          <div className="flex justify-end">
            <X
              size={30}
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>

          <p className="text-heading-05 font-semibold text-surface-600 cursor-pointer">
            Home
          </p>
          <p className="text-heading-05 font-semibold text-surface-600 cursor-pointer">
            Themes
          </p>
          <p className="text-heading-05 font-semibold text-surface-600 cursor-pointer">
            Featured Artists
          </p>
          <p className="text-heading-05 font-semibold text-surface-600 cursor-pointer">
            Membership
          </p>
          <p className="text-heading-05 font-semibold text-surface-600 cursor-pointer">
            About
          </p>
          <p className="text-heading-05 font-semibold text-surface-600 cursor-pointer">
            More
          </p>
        </div>
      )}

      {/* Icons */}
      <div className="hidden sm:flex flex-row gap-10">
        <MessageSquare
          size={30}
          className={`${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        />
        <Search
          size={30}
          className={`${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        />
        <User2
          size={30}
          className={`${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        />
        <ShoppingCart
          size={30}
          className={`${
            scrollLocation > 50 ? "text-surface-600" : "text-white"
          } cursor-pointer`}
        />
      </div>
    </div>
  );
}
