"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from '../../service/supabaseClient'; // Adjust the import path as necessary
import ProfilePic from '../components/ProfileImage'; // Adjust the import path as necessary

const NavBar: React.FC = () => {
    const pathname = usePathname(); // Get the current path
    const [user, setUser] = useState<any>(null); // State for user

    // Fetch the current user
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                setUser(data.user);
            } else if (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    // Function to check if the link matches the current route
    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white border-b shadow-sm">
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
                        />
                    </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center space-x-4">
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
                        
                        <Link href="/profile">
                            <ProfilePic userId={user.id} />
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-indigo-600 hover:underline">
                                Log In
                            </Link>
                            <Link href="/signup">
                                <div className="bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded-md">
                                    Sign Up
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom navigation bar */}
            <div className="bg-white border-t">
                <div className="container mx-auto py-2 px-6 flex justify-center space-x-8">
                    <Link href="/marketplace">
                        <p className={`font-semibold hover:text-pink-700 ${isActive("/marketplace") ? "text-pink-500" : "text-indigo-900"}`}>
                            Womanswear
                        </p>
                    </Link>
                    <Link href="/marketplace">
                        <p className={`font-semibold hover:text-pink-700 ${isActive("/marketplace") ? "text-pink-500" : "text-indigo-900"}`}>
                            Menswear
                        </p>
                    </Link>
                    <Link href="/marketplace">
                        <p className={`font-semibold hover:text-pink-700 ${isActive("/marketplace") ? "text-pink-500" : "text-indigo-900"}`}>
                            Sigmawear
                        </p>
                    </Link>
                    <Link href="/marketplace">
                        <p className={`font-semibold hover:text-pink-700 ${isActive("/marketplace") ? "text-pink-500" : "text-indigo-900"}`}>
                            Explore
                        </p>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
