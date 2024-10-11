"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../service/supabaseClient';

const SignUp: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            // Attempt user sign-up
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });
    
            // Log data and error for debugging purposes
            console.log('Data:', data);
            console.log('SignUp Error:', signUpError);
    
            if (signUpError) {
                setError(`Sign up failed: ${signUpError.message}`);
                setLoading(false);
                return;
            }
    
            // Check if user was successfully created
            if (data?.user) {
                setError('Check your email for the confirmation link.');
            }
    
        } catch (error) {
            console.error('Error occurred during sign up:', error);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }

        // Redirect to the marketplace or login after successful signup
        //router.push('/marketplace');

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading && <p className="text-blue-500">Loading...</p>}
                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center">
                    Already a customer? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
