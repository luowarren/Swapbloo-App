"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // For navigation and extracting dynamic params
import articlesData from "../content.json"; // Import JSON data
import { Article } from "../page"; // Import the Article type from the main resource page

const ArticleDetail: React.FC = () => {
  const router = useRouter(); // Get the router object
  const { id } = useParams();
  const [article, setArticle] = useState<Article | undefined>();

  useEffect(() => {
    if (id) {
      const foundArticle = articlesData.find(
        (article) => article.id === parseInt(id)
      );
      setArticle(foundArticle);
    }
  }, [id]);

  if (!article) {
    return <p className="text-center text-gray-500">Article not found...</p>;
  }

  return (
    <div className="h-[100vh] overflow-scroll pb-[30vh]">
      <div className="min-h-screen py-6 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
          <h1 className="text-4xl font-bold text-indigo-600 italic mb-4">
            {article.title}
          </h1>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />
          {article.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{section.heading}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
