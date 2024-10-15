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
    <div className="max-w-lg rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="h-60 bg-gray-300">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="p-6">
        <p className="text-gray-900 text-xl font-semibold mb-4">
          {article.title}
        </p>
        <Link href={`/resources/${article.id}`} className="text-blue-600 hover:underline text-lg block">
          Read more
        </Link>
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
    <div className="flex flex-col items-center">
      <h2 className="mx-20 mt-8 text-2xl font-semibold text-gray-800 mb-6">
        Resources
      </h2>
      <div className="justify-center mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
