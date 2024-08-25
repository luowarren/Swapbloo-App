/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        <header className="flex justify-between items-center mt-6 pl-8">
          <h1 className="text-3xl font-bold text-indigo-700">swapBLOO!</h1>
          <nav>
            <ul className="flex space-x-4 pr-8">
              <li>
                <a href="#how-it-works" className="text-m text-indigo-800 hover:text-[#000000]">
                  How it works
                </a>
              </li>
              <li>
                <a href="#login" className="text-m text-indigo-800 hover:text-[#000000]">
                  Log in
                </a>
              </li>
              <li>
                <a
                  href="#signup"
                  className="text-m bg-[#C7D2FE] text-indigo-800 hover:bg-indigo-200 py-2 pl-5 pr-5 rounded-full"
                >
                  SIGN UP
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <div className="mt-6 bg-[#F9F3EE] rounded-2xl p-8">
          <main className="flex flex-col lg:flex-row items-center lg:items-start">
            <div className="lg:w-1/2 flex pl-10 flex-col items-center text-center lg:items-start lg:text-left">
              <img src="logo_placeholder.png" className="w-full" />
              <p className=" my-3 text-indigo-900">Snap old. Swap new. SwapBloo!</p>
              <div className="flex w-full gap-x-2 space-x-4">
                <a
                  href="#signup"
                  className="bg-indigo-600 w-2/5 text-white hover:bg-indigo-500 py-2 px-6 rounded-full"
                >
                  Sign up
                </a>
                <a
                  href="#signin"
                  className="bg-yellow-300 w-2/5 text-yellow-950 hover:bg-yellow-200 py-2 px-6 rounded-full"
                >
                  Sign in
                </a>
              </div>
              <div className="flex justify-start mt-6 space-x-6 text-[#4F4F4F]">
                <div className="flex items-center space-x-2">
                  <img src="flower.png" alt="Icon" className="w-6 h-6" />
                  <span className="text-xs text-sky-950">Swap Australia-Wide</span>
                </div>
                <div className="flex items-start space-x-2">
                  <img src="flower.png" alt="Icon" className="w-6 h-6" />
                  <span className="text-xs text-sky-950">This is a Tree</span>
                </div>
                <div className="flex items-start space-x-2">
                  <img src="flower.png" alt="Icon" className="w-6 h-6" />
                  <span className="text-xs text-sky-950">Talk Saxy Rilze</span>
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
              <p className="my-3 text-indigo-900 text-3xl font-extrabold mb-0">POPULAR ON SWAPBLOO</p>
              <p className="my-3 text-indigo-900 text-xs mt-0">Update your wardrobe or try a brand new style - It's Earth approved!</p>
            </div>

            <div className="flex flex-row items-center text-center w-full">
              <div className="lg:w-1/2 flex pl-10 flex-col items-center text-center lg:items-start lg:text-left">
                <p className="my-3 text-indigo-900 text-3xl font-extrabold mb-0">WOMEN</p>
                <div className="flex flex-row items-center text-center">
                  <div className="flex flex-col items-center text-center">
                    <img src="flower.png" alt="Facebook" className="w-20 h-20" />
                    <img src="flower.png" alt="Facebook" className="w-20 h-20" />
                    <img src="flower.png" alt="Facebook" className="w-20 h-20" />
                  </div>
                  <img src="flower.png" alt="Facebook" className="w-40 h-40" />
                </div>
              </div>

              <div className="lg:w-1/2 flex pl-10 flex-col items-center text-center lg:items-start lg:text-left">
                <p className="my-3 text-indigo-900 text-3xl font-extrabold mb-0">MEN</p>
                <div className="flex flex-row items-center text-center">
                  <img src="flower.png" alt="Facebook" className="w-40 h-40" />
                  <div className="flex flex-col items-center text-center">
                    <img src="flower.png" alt="Facebook" className="w-20 h-20" />
                    <img src="flower.png" alt="Facebook" className="w-20 h-20" />
                    <img src="flower.png" alt="Facebook" className="w-20 h-20" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-center w-full" id="see all button">
              <button className="bg-white text-indigo-900 text-xs border border-indigo-900 px-2 py-1 rounded hover:bg-indigo-500">
                See all →
              </button>
            </div>
          </main>
        </div>

        <div className="mt-6 p-8 flex justify-center items-center">
          <main className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="my-3 text-indigo-900 text-3xl font-extrabold mb-0">HOW IT WORKS</p>

            </div>

            <div className="flex flex-row items-center text-center w-full">
              <div className="flex flex-col items-center text-center">
                <img src="flower.png" alt="Facebook" className="w-40 h-40" />
                <p className="my-3 text-indigo-900 text-3xl mb-0">Snap!</p>
                <p className="my-3 text-indigo-900 text-xs mt-0">Snap a pic of items you want to swap and upload with descriptors through QR codes. It takes less than 60 seconds!</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image src='https://nuynivbpnulznjcmtvpq.supabase.co/storage/v1/object/public/images/image_adeline.png' width={400} height={400} alt="Facebook" className="w-40 h-40" />
                <p className="my-3 text-indigo-900 text-3xl mb-0">Swipe!</p>
                <p className="my-3 text-indigo-900 text-xs mt-0">Browse items through tags, search or swipe through options to find your perfect swap.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="flower.png" alt="Facebook" className="w-40 h-40" />
                <p className="my-3 text-indigo-900 text-3xl mb-0">SwapBLOO!!</p>
                <p className="my-3 text-indigo-900 text-xs mt-0">When you make a mathc, you can arrange a swap at one of your designated locations or arrange your own locations!</p>
              </div>
            </div>
          </main>
        </div>

        <div className="mt-6 p-8 flex justify-center items-center">
          <main className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row items-center w-full">
              <img src="flower.png" alt="Facebook" className="w-60 h-60" />
              <div className="flex flex-col">
                <p className="my-3 text-indigo-900 text-3xl font-bold mb-0">Features integrated with love</p>
                <p className="my-3 text-indigo-900 text-xs font-bold mt-0">We love you</p>
                <p className="my-3 text-indigo-900 text-xs mt-0">Your security comes first. With designated meetup locations and two-factor authentication, you can be assured of your safety.</p>
                <p className="my-3 text-indigo-900 text-xs font-bold mt-0">We love fashion</p>
                <p className="my-3 text-indigo-900 text-xs mt-0">SwapBloo will forever be free. We want you to be able to swap to your heart's desire and complete a closet that you truly love.</p>
                <p className="my-3 text-indigo-900 text-xs font-bold mt-0">We love the Earth</p>
                <p className="my-3 text-indigo-900 text-xs mt-0">Thousands of garments from landfill by swappers like you but that's not all. For every successful swap, earn 1 Earth Token and we will plan a real tree in Australia for every 50 you collect!</p>
              </div>
            </div>
          </main>
        </div>

        <footer className="bg-indigo-800 text-white mt-10 mb-6 py-8 rounded-2xl">
          <div className="container mx-auto px-20 py-20 flex justify-between items-start">

            <div>
              <div className="mb-4 text-3xl font-bold">SwapBLOO!</div>
              <div className="flex space-x-4">
                <img src="flower.png" alt="Facebook" className="w-6 h-6" />
                <img src="flower.png" alt="Twitter" className="w-6 h-6" />
                <img src="flower.png" alt="Instagram" className="w-6 h-6" />
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">SWAP MARKET</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:underline">Menswear</a></li>
                <li><a href="#" className="text-sm hover:underline">Womenswear</a></li>
                <li><a href="#" className="text-sm hover:underline">Post A Swap</a></li>
                <li><a href="#" className="text-sm hover:underline">How It Works</a></li>
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
                  className="bg-yellow-200 text-indigo-800 outline outline-yellow-200 hover:bg-yellow-100 font-bold px-4 py-2">
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};