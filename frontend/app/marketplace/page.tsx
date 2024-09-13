import React from 'react';

export default function Login() {
    return (
        <div className="min-h-screen bg-white">

            {/* New listings by people you follow */}
            <section className="my-8 mx-4">
                <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">New listings by people you follow</h2>
                <div className="flex justify-center overflow-x-scroll">
                    <Card image="purple.jpg" brand="Cotton On" size="6" />
                    <Card image="purple.jpg" brand="Factorie" size="12" />
                    <Card image="purple.jpg" brand="Nike" size="XS" />
                    <Card image="purple.jpg" brand="Lacoste" size="8" />
                    <Card image="purple.jpg" brand="Uniqlo" size="XL" />
                </div>
            </section>

            {/* New listings near you */}
            <section className="my-8 mx-4">
                <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">New listings near you</h2>
                <div className="flex justify-center overflow-x-scroll">
                    <Card image="purple.jpg" brand="Cotton On" size="6" />
                    <Card image="purple.jpg" brand="Factorie" size="12" />
                    <Card image="purple.jpg" brand="Nike" size="XS" />
                    <Card image="purple.jpg" brand="Lacoste" size="8" />
                    <Card image="purple.jpg" brand="Uniqlo" size="XL" />
                </div>
            </section>

            {/* Swap by type */}
            <section className="my-8 mx-4">
                <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">Swap by type</h2>
                <div className="flex justify-center">
                    <Card image="purple.jpg" />
                    <Card image="purple.jpg" />
                    <Card image="purple.jpg" />
                    <Card image="purple.jpg" />
                </div>
            </section>
        </div>
    );
};

// Card Component
interface CardProps {
    image: string;
    brand?: string;
    size?: string;
}

const Card: React.FC<CardProps> = ({ image, brand, size }) => {
    return (
        <div className="flex flex-col justify-end p-2 relative">
            <div className="relative">
                <img src="purple.jpg" className="w-48 h-48 rounded-lg" />
                <img src="jojo.png" className="absolute bottom-2 right-2 w-10 rounded-full" />
            </div>
            <p className="mt-2 text-sm font-semibold"></p>
            <p className="text-xs text-gray-600">{size} · {brand}</p>
        </div>
    );
};
