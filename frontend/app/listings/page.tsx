"use client";
import Listings from "./listings";
import Sidebar from "./sidebar";
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { supabase } from "@/service/supabaseClient";
import { useRouter } from 'next/navigation'; // Next.js router for redirection

const ListingsPage = () => {
  const [loading, setLoading] = useState(true); // For handling the loading state
  const router = useRouter();
  
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push('/login'); // Redirect to /login if no user is found
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  return (
    <div className="flex flex-row">
      <Sidebar filter={null} />
      <Listings />
    </div>
  );
};

export default ListingsPage;
