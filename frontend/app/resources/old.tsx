"use client"; // Ensure this component is rendered on the client

import React, { useEffect, useState } from 'react';
import articlesData from './content.json'; // Import the JSON data

interface ResourceCardProps {
    title: string;
    imageSrc: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, imageSrc }) => {
    return (
        <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white">
            <div className="h-60 bg-gray-300">
                <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <p className="text-gray-900 text-lg font-medium mb-2">{title}</p>
                <a href="/article" className="text-blue-600 hover:underline mt-4 block">Learn more</a>
            </div>
        </div>
    );
};

const Resources: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);

    // Load data from JSON file or an API
    useEffect(() => {
        // If fetching from an API, replace with a fetch call.
        setArticles(articlesData);
    }, []);

    return (
        <section className="flex flex-col items-center">
            <h2 className="mx-20 mt-8 text-2xl font-semibold text-gray-800 mb-6">Resources</h2>
            <div className="justify-center mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                    <ResourceCard
                        key={index}
                        title={article.title}
                        imageSrc={article.image}
                    />
                ))}
            </div>
        </section>
    );
};

export default Resources;

