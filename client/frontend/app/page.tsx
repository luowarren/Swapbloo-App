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