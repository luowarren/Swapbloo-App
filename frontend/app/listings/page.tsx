"use client";
import { useState, useEffect } from "react";
import Listings from "./listings";
import Sidebar from "./sidebar";

export type filterType = {
  size: string[];
  condition: string[];
  category: string[];
  demographic: string[];
};
import { supabase } from "@/service/supabaseClient";
import { useRouter } from "next/navigation"; // Next.js router for redirection

const ListingsPage = () => {
  const [filter, setFilter] = useState<filterType>({
    size: [],
    condition: [],
    category: [],
    demographic: [],
  });

  const [loading, setLoading] = useState(true); // For handling the loading state
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login"); // Redirect to /login if no user is found
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  return (
    <div className="flex flex-row">
      <Sidebar filter={filter} setFilter={setFilter} />
      <Listings filter={filter} />
    </div>
  );
};

export default ListingsPage;
