"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import articlesData from "./content.json"; // Adjust path as needed

type Section = {
  heading: string;
  content: string;
};

export type Article = {
  id: number;
  title: string;
  image: string;
  sections: Section[];
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="max-w-lg overflow-hidden">
      <div className="h-60">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="">
        <p className="text-gray-600 italic text-xl font-semibold mt-4">
          {article.title}
        </p>
        <div className="bg-indigo-500 w-fit p-2 px-4 rounded-md text-white mt-4 hover:bg-indigo-800 transition">
          <Link href={`/resources/${article.id}`} className="text-md block">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

const ResourcesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(articlesData.slice(0, 8)); // Show only 8 articles
  }, []);

  return (
    <div className="flex flex-col items-center px-20 h-[100vh] overflow-scroll pb-[20vh]">
      <div className="mt-8 text-5xl font-bold text-indigo-600 mb-2 w-full italic">
        Learn eco!
      </div>
      <div className="text-md font-medium text-gray-500 mb-6 w-full">
        Learn the latest news on fashion and clothing waste, and how SwapBloo
        intends to fight it!
      </div>
      <div className="justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-center text-gray-500">Loading articles...</p>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
