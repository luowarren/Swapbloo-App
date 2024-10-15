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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleUser,
  HomeIcon,
  LogOut,
  Mail,
  MessageCircle,
  Search,
  Sprout,
  Store,
} from "lucide-react";

const NavBar: React.FC = () => {
  const pathname = usePathname(); // Get the current path
  const [user, setUser] = useState<any>(null); // State for user
  const [search, setSearch] = useState(""); // State for search input
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
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

  if (pathname === "/onboard") return;

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

  return (
    <div
      ref={navRef}
      className={cn(
        "bg-white transition-all sticky top-0 z-50 border-b border-gray-300"
      )}
    >
      <div className="container mx-auto flex items-center justify-between py-2 px-6">
        {/* Left side: Logo */}
        <div className="flex items-center">
          <a href="/" className="text-indigo-700 font-medium text-xl">
            swap<span className="font-black">BLOO!</span>
          </a>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow mx-8">
          <div className="flex justify-center items-center gap-2 w-full px-4 py-2 rounded-full border border-gray-300">
            <Search className="h-h w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch} // Handle Enter key
            />
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center space-x-2 relative">
          {user && (
            <Link href="/listing">
              <div className="hover:bg-indigo-50 transition text-indigo-600 font-semibold py-2 px-4 rounded-full">
                LIST AN ITEM
              </div>
            </Link>
          )}

          <Link href="/listings">
            <div className="flex justify-center items-center bg-indigo-100 text-indigo-600 font-semibold p-2 rounded-full hover:bg-indigo-200 transition">
              <HomeIcon />
            </div>
          </Link>

          {user && (
            <Link href="/chats">
              <div className="flex justify-center items-center bg-indigo-100 text-indigo-600 font-semibold p-2 rounded-full hover:bg-indigo-200 transition">
                <Mail />
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
                <DropdownMenuContent className="mr-2">
                  <div className="w-48 bg-white z-10">
                    <div
                      onClick={() => {
                        router.push("/chats");
                      }}
                      className="flex gap-2 items-center px-2 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition rounded font-medium"
                    >
                      <Mail className="h-5 w-5" />
                      Inbox
                    </div>
                    <div
                      onClick={() => {
                        router.push("/profile");
                      }}
                      className="flex gap-2 items-center px-2 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition rounded font-medium"
                    >
                      <Store className="h-5 w-5" />
                      My store
                    </div>
                    <div
                      onClick={() => {
                        router.push("/resources");
                      }}
                      className="flex gap-2 items-center px-2 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition rounded font-medium"
                    >
                      <Sprout className="h-5 w-5" />
                      Learn eco
                    </div>
                    <DropdownMenuSeparator />
                    <div
                      onClick={handleLogout}
                      className="flex gap-2 items-center px-2 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition rounded font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      Log out
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
    </div>
  );
};

export default NavBar;
