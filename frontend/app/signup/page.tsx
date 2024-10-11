"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../service/supabaseClient";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Attempt user sign-up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      // Log data and error for debugging purposes
      console.log("Data:", data);
      console.log("SignUp Error:", signUpError);

      if (signUpError) {
        setError(`Sign up failed: ${signUpError.message}`);
        setLoading(false);
        return;
      }

      // Check if user was successfully created
      if (data?.user) {
        setError("Check your email for the confirmation link.");
      }
    } catch (error) {
      console.error("Error occurred during sign up:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }

    // Redirect to the marketplace or login after successful signup
    //router.push('/marketplace');

    setLoading(false);
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
          Sign up
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignUp}>
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
          Already with us?{" "}
          <a href="/signup" className="text-indigo-500 hover:underline">
            Log in here
          </a>
        </p>
        <div className="w-full flex my-4 text-gray-400 font-bold justify-center">
          OR
        </div>
        <div className="w-full flex flex-row items-center my-2 py-2 rounded-md bg-gray-100 font-medium justify-center text-gray-600">
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google logo"
            className="w-7 h-7 mr-2"
          />
          Sign in with Google
        </div>
      </div>
    </div>
  );
};

export default SignUp;
