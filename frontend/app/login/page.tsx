"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../service/supabaseClient";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/listings");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const { error: googleSignInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/listings`, // Optional: Set redirect URL after sign-in
        },
      });

      if (googleSignInError) {
        setError(`Google sign-in failed: ${googleSignInError.message}`);
        return;
      }
    } catch (error) {
      console.error("Error occurred during Google sign-in:", error);
      setError("An unexpected error occurred.");
    } finally {
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-indigo-500"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-vector/seamless-woman-s-stylish-bags-sketch_98292-4347.jpg?t=st=1728605120~exp=1728608720~hmac=61089c7da794f909b80d339eb78cab0540624f18bb6216f2955b7946ddb9e25f&w=1380)",
        backgroundSize: "800px", // Adjust the size of the image
        backgroundRepeat: "repeat", // Set the background to repeat
        backgroundPosition: "top left", // Set the starting point of the image
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-4xl font-bold mb-6 italic text-indigo-700">
          Login
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-800 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Not a customer?{" "}
          <a href="/signup" className="text-indigo-500 hover:underline">
            Sign up here
          </a>
        </p>
        <div className="w-full flex my-4 text-gray-400 font-bold justify-center">
          OR
        </div>
        <div
          className="w-full flex flex-row items-center my-2 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition font-medium justify-center text-gray-600"
          onClick={handleGoogleSignIn}
        >
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google logo"
            className="w-7 h-7 mr-2"
          />
          Login with Google
        </div>
      </div>
    </div>
  );
};

export default Login;
