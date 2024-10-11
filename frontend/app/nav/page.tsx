"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../service/supabaseClient"; // Adjust the import path as necessary
import ProfilePic from "../components/ProfileImage"; // Adjust the import path as necessary
import { signOutUser } from "../../service/auth"; // Import logout function
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar: React.FC = () => {
  const pathname = usePathname(); // Get the current path
  const [user, setUser] = useState<any>(null); // State for user
  const [search, setSearch] = useState(""); // State for search input
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
  const [isScrolled, setIsScrolled] = useState(false); // State to track if the user has scrolled
  const navRef = useRef<HTMLDivElement>(null); // Ref for the navbar div
  const router = useRouter();

  // Fetch the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      } else if (error) {
        router.push("/");
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user); // Update the user state when logged in
        } else {
          setUser(null); // Clear the user state when logged out
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Function to handle the search input submission (pressing Enter)
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      const encodedSearch = encodeURIComponent(search.trim());
      router.push(`/listings/${encodedSearch}`);
    }
  };

  // Function to check if the link matches the current route
  const isActive = (path: string) => pathname === path;

  // Handle log out
  const handleLogout = async () => {
    await signOutUser();
    setUser(null); // Clear user from state after logout
    setShowTooltip(false); // Close the tooltip after logout
    router.push("/");
  };

  // Check if the user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down from the top of the page
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={navRef}
      className={cn(
        "bg-transparent mx-16 rounded-b-2xl transition-all sticky top-0 z-50",
        isScrolled && "border-b border-x shadow-sm bg-white"
      )}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left side: Logo */}
        <div className="flex items-center">
          <a href="/" className="text-indigo-700 font-medium text-xl">
            swap<span className="font-black">BLOO!</span>
          </a>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch} // Handle Enter key
            />
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center space-x-4 relative">
          {/* List an item button */}
          {user && (
            <Link href="/listing">
              <div className="bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded-md">
                LIST AN ITEM
              </div>
            </Link>
          )}

          {/* User profile icon or Login/Signup */}
          {user ? (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="cursor-pointer"
                  >
                    <ProfilePic userId={user.id} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="w-48 bg-white z-10">
                    <Link href="/profile" onClick={() => setShowTooltip(false)}>
                      <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition rounded font-semibold">
                        View Profile
                      </div>
                    </Link>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition rounded font-semibold"
                    >
                      Log Out
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* {showTooltip && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-2 z-10">
                  <Link href="/profile" onClick={() => setShowTooltip(false)}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      View Profile
                    </div>
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Log Out
                  </div>
                </div>
              )} */}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-indigo-800 font-bold hover:underline"
              >
                Log In
              </Link>
              <Link href="/signup">
                <div className="bg-indigo-100 text-indigo-600 font-bold py-2 px-4 rounded-md">
                  Sign Up
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className={cn(isScrolled && "border-t")}>
        <div className="container mx-auto py-2 px-6 flex justify-center space-x-8">
          <Link href="/listings/">
            <p className={`font-semibold hover:text-pink-700 text-indigo-900`}>
              Items
            </p>
          </Link>
          <Link href="/marketplace">
            <p className={`font-semibold hover:text-pink-700 text-indigo-900`}>
              Menswear
            </p>
          </Link>
          <Link href="/marketplace">
            <p className={`font-semibold hover:text-pink-700 text-indigo-900`}>
              Sigmawear
            </p>
          </Link>
          <Link href="/chats">
            <p className={`font-semibold hover:text-pink-700 text-indigo-900`}>
              Chat
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
