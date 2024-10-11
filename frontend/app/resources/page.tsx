"use client";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import articlesData from './content.json'; // Import the JSON data


type Section = {
    heading: string;
    content: string;
};

type Article = {
    id: number;
    title: string;
    image: string;
    sections: Section[];
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    return (
        <div className="max-w-lg rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="h-60 bg-gray-300">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="p-6">
                <p className="text-gray-900 text-xl font-semibold mb-4">{article.title}</p>
                <Link to={`/article/${article.id}`} className="text-blue-600 hover:underline text-lg block">
                    Read more
                </Link>
            </div>
        </div>
    );
};

// Main Page: Displays previews of 8 articles (now accessible via /resources)
const ResourcesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        setArticles(articlesData.slice(0, 8)); // Show only 8 articles
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h2 className="mx-20 mt-8 text-2xl font-semibold text-gray-800 mb-6">Resources</h2>
            <div className="justify-center mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        <ArticleCard key={index} article={article} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">Loading articles...</p>
                )}
            </div>
        </div>
    );
};

// Detailed Article Page: Displays full article based on the ID
const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | undefined>();

    useEffect(() => {
        const foundArticle = articlesData.find((article) => article.id === parseInt(id!));
        setArticle(foundArticle);
    }, [id]);

    if (!article) {
        return <p className="text-center text-gray-500">Article not found...</p>;
    }

    return (
        <div className="min-h-screen py-6 flex flex-col justify-center">
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-4">
                <h1 className="text-3xl font-semibold mb-4">{article.title}</h1>
                <img src={article.image} alt={article.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                {article.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{section.heading}</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// App Component: Manages routes, including /resources and /article/:id
const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ResourcesPage />} /> {/* Main page as / */}
                <Route path="/resources" element={<ResourcesPage />} /> {/* Resources page */}
                <Route path="/article/:id" element={<ArticleDetail />} /> {/* Article detail page */}
            </Routes>
        </Router>
    );
};

export default App;
