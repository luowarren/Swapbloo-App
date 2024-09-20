"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation

const NavBar: React.FC = () => {
  const pathname = usePathname(); // Get the current path

  // Function to check if the link matches the current route
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left side: Logo */}
        <div className="flex items-center">
          <a href="/" className="text-indigo-900 font-bold text-xl">
            swap<span className="text-blue-600">BLOO!</span>
          </a>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center space-x-4">
          {/* List an item button */}
          <button className="bg-blue-100 text-blue-600 font-semibold py-2 px-4 rounded-md">
            LIST AN ITEM
          </button>

          {/* Notification icon */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405M9 21h6M4 7h16M4 3h16M4 11h16M4 15h16"
              />
            </svg>
          </button>

          {/* Favorites icon */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 21l-1-1m-4-6a6 6 0 018 0m-4-9a6 6 0 100 12m6 6l1-1M7 7m3 2a4 4 0 104-4 4 4 0 00-4 4z"
              />
            </svg>
          </button>

          {/* User profile icon */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l-4 4m8-8l-4 4M12 6l-4 4m8-8l-4 4m4 8l-4 4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="bg-white border-t">
        <div className="container mx-auto py-2 px-6 flex justify-center space-x-8">
        <Link href="/marketplace">
            <p className={`font-semibold hover:text-pink-700 ${
              isActive("/swipemode") ? "text-pink-500" : "text-indigo-900"
            }`}>
                Womanswear
            </p>
            </Link>
            <Link href="/marketplace">
            <p className={`font-semibold hover:text-pink-700 ${
              isActive("/swipemode") ? "text-pink-500" : "text-indigo-900"
            }`}>
                Menswear
            </p>
            </Link>
          <Link href="/marketplace">
            <p className={`font-semibold hover:text-pink-700 ${
              isActive("/swipemode") ? "text-pink-500" : "text-indigo-900"
            }`}>
                Sigmawear
            </p>
            </Link>
            <Link href="/marketplace">
            <p className={`font-semibold hover:text-pink-700 ${
              isActive("/swipemode") ? "text-pink-500" : "text-indigo-900"
            }`}>
                Explore
            </p>
            </Link>
        
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
