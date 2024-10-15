/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImageDisplay from "./components/ImageDisplay";
import ItemImages from "./components/ItemImages";
import Link from "next/link";
import {
  Earth,
  Facebook,
  HandHeart,
  Instagram,
  Map,
  Shirt,
  TreePalm,
  Twitter,
} from "lucide-react";
import { supabase } from "@/service/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<any>(null); // State for user

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      } else if (error) {
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
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div>
        <div className="mx-32 -mt-12 pt-20 bg-[#F9F3EE] rounded-2xl p-8">
          <main className="flex flex-col lg:flex-row items-center lg:items-start">
            <div className="lg:w-1/2 flex pl-10 flex-col items-center text-center lg:items-start lg:text-left">
              <img src="logo_placeholder.png" className="w-full" />
              <p className="font-semibold my-3 text-indigo-900">
                Snap old. Swap new. SwapBloo!
              </p>
              <div className="flex w-full gap-2">
                {user ? (
                  <>
                    <Link href="/listings">
                      <p className="text-m bg-indigo-600 text-white py-2 px-6 rounded-md">
                        Browse Items
                      </p>
                    </Link>
                    <Link href="/chats">
                      <p className="text-m bg-yellow-300 hover:bg-indigo-200 py-2 px-9 rounded-md transition">
                        View Chats
                      </p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <p className="text-m bg-indigo-600 text-white py-2 px-10 rounded-md">
                        Log in
                      </p>
                    </Link>

                    <Link href="/signup">
                      <p className="text-m bg-yellow-300 hover:bg-indigo-200 py-2 px-9 rounded-md transition">
                        Sign up
                      </p>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex justify-start gap-4 mt-6 text-indigo-950">
                <div className="flex items-center gap-1">
                  <Map className="w-5 h-5" />
                  <span className="text-xs font-semibold">Australia</span>
                </div>
                <div className="flex items-center gap-1">
                  <TreePalm className="w-5 h-5" />
                  <span className="text-xs font-semibold">Reduce CO2</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shirt className="w-5 h-5" />
                  <span className="text-xs font-semibold">Try new styles</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <img
                src="placeholder.png"
                alt="Swapping clothes"
                className="ml-auto size-5/6 h-auto rounded-3xl"
              />
            </div>
          </main>
        </div>

        <div className="mt-6 p-8 flex justify-center items-center">
          <main className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="my-3 text-indigo-700 text-5xl font-extrabold mb-0 italic">
                POPULAR ON SWAPBLOO
              </p>
              <p className="my-3 text-indigo-900 text-sm mt-0">
                Update your wardrobe or try a brand new style - It's Earth
                approved!
              </p>
            </div>

            <div className="flex flex-row gap-2 justify-center items-center text-center w-full">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left hover:scale-110 transition">
                <p className="my-3 text-indigo-900 text-3xl font-extrabold mb-2">
                  WOMEN
                </p>
                <div className="flex flex-row items-center text-center">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="nike 1.png"
                      alt="Facebook"
                      className="w-[131px] h-[131px] mb-3"
                    />
                    <img
                      src="lululemon 1.png"
                      alt="Facebook"
                      className="w-[131px] h-[131px] mb-3"
                    />
                    <img
                      src="new balance 1.png"
                      alt="Facebook"
                      className="w-[131px] h-[131px]"
                    />
                  </div>
                  <img
                    src="cottage core.png"
                    alt="Facebook"
                    className="w-80 ml-3"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center text-center lg:items-start lg:text-left hover:scale-110 transition">
                <p className="my-3 text-indigo-900 text-3xl font-extrabold mb-2">
                  MEN
                </p>
                <div className="flex flex-row items-center text-center">
                  <img
                    src="street style.png"
                    alt="Facebook"
                    className="w-80 h-full mr-3"
                  />
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="nike 2.png"
                      alt="Facebook"
                      className="w-[131px] h-[131px] mb-3"
                    />
                    <img
                      src="lululemon 2.png"
                      alt="Facebook"
                      className="w-[131px] h-[131px] mb-3"
                    />
                    <img
                      src="new balance 2.png"
                      alt="Facebook"
                      className="w-[131px] h-[131px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-center text-center w-full mt-8"
              id="see all button"
            >
              <button className="bg-white text-indigo-900 text-sm font-medium border border-indigo-900 px-2 py-1 rounded hover:bg-indigo-500">
                See all →
              </button>
            </div>
          </main>
        </div>

        <div className="mt-6 p-8 py-20 flex justify-center items-center bg-indigo-700 w-full">
          <main className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="my-3 text-indigo-100 text-5xl font-extrabold mb-4 italic">
                HOW IT WORKS
              </p>
            </div>

            <div className="flex flex-row gap-5 mt-4 justify-center items-center w-full">
              <div className="flex flex-col items-center text-center max-w-xs">
                <img
                  src="landing page 1.png"
                  alt="Snap"
                  className="w-56 h-56 rounded-xl mb-1"
                />
                <p className="mt-3 text-indigo-100 text-3xl">Snap!</p>
                <p className="my-3 px-4 text-white text-sm">
                  Snap a pic of items you want to swap and upload with
                  descriptors through QR codes. It takes less than 60 seconds!
                </p>
              </div>
              <div className="flex flex-col items-center text-center max-w-xs">
                <img
                  src="landing page 2.png"
                  alt="Swipe"
                  className="w-56 h-56 rounded-xl mb-1"
                />
                <p className="mt-3 text-indigo-100 text-3xl">Swipe!</p>
                <p className="my-3 px-4 text-white text-sm ">
                  Browse items through tags, search or swipe through options to
                  find your perfect swap.
                </p>
              </div>
              <div className="flex flex-col items-center text-center max-w-xs">
                <img
                  src="landing page 3.png"
                  alt="SwapBLOO"
                  className="w-56 h-56 rounded-xl mb-1"
                />
                <p className="mt-3 text-indigo-100 text-3xl ">SwapBLOO!!</p>
                <p className="my-3 px-4 text-white text-sm">
                  When you make a mathc, you can arrange a swap at one of your
                  designated locations or arrange your own locations!
                </p>
              </div>
            </div>
          </main>
        </div>

        <div className="mt-6 p-8 flex justify-center items-center mx-32">
          <main className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row items-center w-full">
              <img
                src="landing page 4.png"
                alt="Features"
                className="rounded-3xl h-96 mr-8"
              />
              <div className="flex flex-col">
                <p className="my-3 text-indigo-900 text-5xl font-bold mb-4 italic">
                  Features integrated with love
                </p>
                <div className="flex flex-row gap-2 items-start mb-4">
                  <HandHeart className="min-w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-indigo-900 text-sm font-bold mt-0">
                      We love you
                    </p>
                    <p className="text-indigo-900 text-sm mt-2">
                      Your security comes first. With designated meetup
                      locations and two-factor authentication, you can be
                      assured of your safety.
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-start mb-4">
                  <Shirt className="min-w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-indigo-900 text-sm font-bold mt-0">
                      We love fashion
                    </p>
                    <p className="text-indigo-900 text-sm mt-2">
                      SwapBloo will forever be free. We want you to be able to
                      swap to your heart's desire and complete a closet that you
                      truly love.
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-start">
                  <Earth className="min-w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-indigo-900 text-sm font-bold mt-0">
                      We love the Earth
                    </p>
                    <p className="text-indigo-900 text-sm mt-2">
                      Thousands of garments from landfill by swappers like you
                      but that's not all. For every successful swap, earn 1
                      Earth Token and we will plan a real tree in Australia for
                      every 50 you collect!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <footer className="bg-indigo-800 text-white mt-10 mb-6 py-8 rounded-2xl mx-32">
          <div className="container mx-auto px-20 py-20 flex justify-between items-start">
            <div>
              <div className="mb-4 text-3xl font-bold">SwapBLOO!</div>
              <div className="flex space-x-4">
                <Instagram />
                <Twitter />
                <Facebook />
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">SWAP MARKET</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Menswear
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Womenswear
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Post A Swap
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">STAY UP TO DATE</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 focus:outline-none bg-indigo-800 outline outline-yellow-200"
                />
                <button
                  type="submit"
                  className="bg-yellow-200 text-indigo-800 outline outline-yellow-200 hover:bg-yellow-100 font-bold px-4 py-2"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </footer>
      </div>
      <div className="lg:w-1/2 mt-10 lg:mt-0"></div>
    </div>
  );
}
