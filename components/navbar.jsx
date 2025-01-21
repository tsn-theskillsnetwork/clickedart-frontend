"use client";

import {
  MessageSquare,
  Search,
  ShoppingCart,
  User2,
  Menu,
  X,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Signout from "./auth/signout";
import useAuthStore from "@/authStore";
import useCartStore from "@/store/cart";
import useWishlistStore from "@/store/wishlist";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageSearch from "./search";
import { Input } from "./ui/input";
import Button from "./button";

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push(`/search?search=${search}`);
  };

  const { user, photographer } = useAuthStore();
  const { cartItems } = useCartStore();
  const { wishlist, fetchWishlist } = useWishlistStore();

  // const [wishlist, setWishlist] = useState([]);
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

  const MoreDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`text-sm md:text-md lg:text-lg xl:text-xl px-1 xl:px-4 py-2 rounded-lg text-center font-semibold ${
            scrollLocation > 50 || pathname !== "/"
              ? "text-surface-600"
              : "text-white"
          } cursor-pointer ${isOpen ? "menuActive" : "menuHover"}`}
        >
          More
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-max p-2 rounded-md z-10">
            <Link
              href="/blog"
              className={`text-sm md:text-md lg:text-lg xl:text-xl px-1 xl:px-4 py-2 rounded-lg text-center font-semibold ${
                pathname.startsWith("/blog") ? "menuActive" : "menuHover"
              } cursor-pointer block`}
            >
              Blog
            </Link>
            <Link
              href="/story"
              className={`text-sm md:text-md lg:text-lg xl:text-xl px-1 xl:px-4 py-2 rounded-lg text-center font-semibold ${
                pathname.startsWith("/story") ? "menuActive" : "menuHover"
              } cursor-pointer block`}
            >
              Story
            </Link>
            <Link
              href="/contact"
              className={`text-sm md:text-md lg:text-lg xl:text-xl px-1 xl:px-4 py-2 rounded-lg text-center font-semibold ${
                pathname.startsWith("/contact") ? "menuActive" : "menuHover"
              } cursor-pointer block`}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    );
  };

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

  useEffect(() => {
    user && fetchWishlist(user?._id);
  }, [user]);

  return (
    <div
      className={`fixed flex flex-row items-center justify-between px-6 gap-5 sm:px-10 ${
        scrollLocation > 50 || pathname !== "/"
          ? "bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] "
          : "bg-transparent shadow-none"
      } h-20 sm:h-24 z-50 w-full`}
    >
      <Link href={"/"} className="hidden lg:block">
        {scrollLocation > 50 || pathname !== "/" ? (
          <Image
            src="/assets/Logo.png"
            className="h-auto w-4/5"
            alt="logo"
            priority
            width={200}
            height={50}
          />
        ) : (
          <Image
            src="/assets/logoWhite.png"
            className="h-auto w-4/5"
            alt="logo"
            width={200}
            height={50}
          />
        )}
      </Link>

      {/* Mobile Logo (buttons) */}
      <Link
        href={"/"}
        className="lg:hidden w-full flex flex-row gap-2 items-center justify-between"
      >
        {scrollLocation > 50 || pathname !== "/" ? (
          <Image
            src="/assets/Logo.png"
            className="h-8 max-w-max"
            alt="logo"
            priority
            width={200}
            height={50}
          />
        ) : (
          <Image
            src="/assets/logoWhite.png"
            className="h-8 max-w-max"
            alt="logo"
            width={200}
            height={50}
          />
        )}
      </Link>

      {/* Mobile Navbar */}
      <div className="lg:hidden pt-0">
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

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-row gap-2">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.url}>
            <p
              className={`text-sm md:text-md lg:text-lg xl:text-xl px-1 xl:px-4 py-2 rounded-lg text-center font-semibold ${
                scrollLocation > 50 || pathname !== "/"
                  ? "text-surface-600"
                  : "text-white"
              } cursor-pointer ${
                item.url === "/"
                  ? pathname === item.url
                    ? "menuActive"
                    : "menuHover"
                  : pathname.startsWith(item.url)
                  ? "menuActive"
                  : "menuHover"
              }`}
            >
              {item.name}
            </p>
          </Link>
        ))}
        <MoreDropdown />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-0 left-0 right-0 bg-white shadow-lg p-6 lg:hidden flex flex-col gap-4"
        >
          <div className="flex justify-end">
            <X
              size={30}
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>

          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              onClick={() => setIsMenuOpen(false)}
            >
              <p className="text-lg font-semibold text-black cursor-pointer">
                {item.name}
              </p>
            </Link>
          ))}
          <Link href="/blog">
            <p className="text-lg font-semibold text-black cursor-pointer">
              Blog
            </p>
          </Link>
          <Link href="/story">
            <p className="text-lg font-semibold text-black cursor-pointer">
              Story
            </p>
          </Link>
          <Link href="/contact">
            <p className="text-lg font-semibold text-black cursor-pointer">
              Contact Us
            </p>
          </Link>

          {user || photographer ? (
            <>
              <Link href="/profile">
                <p className="text-lg font-semibold text-black cursor-pointer">
                  Profile
                </p>
              </Link>
              <Signout variant="text" />
            </>
          ) : (
            <Link href="/signin">
              <p className="text-lg font-semibold text-black cursor-pointer">
                Sign In
              </p>
            </Link>
          )}

          <Link href="/wishlist">
            <p className="text-lg font-semibold text-black cursor-pointer">
              Wishlist ({wishlist?.length > 0 ? wishlist.length : 0})
            </p>
          </Link>
          <Link href="/cart">
            <p className="text-lg font-semibold text-black cursor-pointer">
              Cart ({cartItems?.length > 0 ? cartItems.length : 0})
            </p>
          </Link>
        </div>
      )}

      <div className="hidden lg:flex flex-row gap-2 xl:gap-10">
        <Dialog>
          <DialogTrigger>
            <Search
              className={`${
                scrollLocation > 50 || pathname !== "/"
                  ? "text-surface-600"
                  : "text-white"
              } cursor-pointer`}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search for images"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {user || photographer ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/profile">
                    <User2
                      className={`${
                        scrollLocation > 50 || pathname !== "/"
                          ? `${user ? "text-surface-600" : "text-blue-500"}`
                          : "text-white"
                      } cursor-pointer`}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white font-medium">
                    {photographer ? "Photographer Profile" : "User Profile"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Signout />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white font-medium">Sign Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href="/signin">
                  <User2
                    className={`${
                      scrollLocation > 50 || pathname !== "/"
                        ? "text-surface-600"
                        : "text-white"
                    } cursor-pointer`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-white font-medium">Sign In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Link href="/wishlist" className="relative">
          <Heart
            className={`${
              scrollLocation > 50 || pathname !== "/"
                ? "text-surface-600"
                : "text-white"
            } cursor-pointer`}
          />
          {wishlist?.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <p className="text-xs text-white font-semibold">
                {wishlist.length}
              </p>
            </div>
          )}
        </Link>
        <Link href="/cart" className="relative">
          <ShoppingCart
            className={`${
              scrollLocation > 50 || pathname !== "/"
                ? "text-surface-600"
                : "text-white"
            } cursor-pointer`}
          />
          {cartItems?.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <p className="text-xs text-white font-semibold">
                {cartItems.length}
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
