"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../service/supabaseClient';

const SignUp: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [image, setImage] = useState<string>(''); // Assume image URL or base64 string
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        // Sign up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            console.log(signUpError)
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        // Insert user data into the users table
        const { error: insertError } = await supabase
            .from('public.users')
            .insert([{
                id: user?.id, // Assuming user ID is the same as the supabase user ID
                name,
                location,
                description,
                dob,
                image,
                created_at: new Date().toISOString(), // Auto-generated timestamp
            }]);

        if (insertError) {
            console.log("insert error",insertError)
            setError(insertError.message);
        } else {
            router.push('/marketplace');
        }
        
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading && <p className="text-blue-500">Loading...</p>}
                <form onSubmit={handleSignUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium">Name:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Location:</label>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium">Description:</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date of Birth:</label>
                        <input 
                            type="date" 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)} 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Image URL:</label>
                        <input 
                            type="text" 
                            value={image} 
                            onChange={(e) => setImage(e.target.value)} 
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
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
                    <div className="sm:col-span-2">
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
