"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the `useRouter` hook from next/navigation
import { getActiveListings, getImageFromId } from '../../service/items'; // Import your Supabase function
import ItemImages from '../components/ItemImages';
import ProfileImage from '../components/ProfileImage';

interface Listing {
    id: number;
    brand: string;
    size: string;
    image?: string; // Image ID from the listing data
    imageUrl?: string; // This will be the actual image URL
    owner_id: string;
}

export default function Login() {
    const [listings, setListings] = useState<Listing[]>([]);
    
    useEffect(() => {
        async function fetchListingsAndImages() {
            const { data, error } = await getActiveListings();
            if (error) {
                console.error('Error fetching listings:', error);
            } else if (data) {
                // For each listing, we fetch the image
                console.log('wooo', data);

                const listingsWithImages = await Promise.all(
                    
                    data.map(async (listing: Listing) => {
                        
                        if (listing.image) {
                            const imageBlobOrError = await getImageFromId(listing.image, 'images');
                            
                            if (imageBlobOrError instanceof Blob) {
                                // Create URL from the image blob if it's a valid Blob
                                const imageUrl = URL.createObjectURL(imageBlobOrError);
                                console.log('imaging', imageUrl)
                                return { ...listing, imageUrl }; // Add the imageUrl to the listing object
                            } else {
                                // Handle the error case and return listing without imageUrl
                                console.error('Error fetching image:', imageBlobOrError);
                                return listing;
                            }
                        }
                        return listing;
                    })
                );
                setListings(listingsWithImages); // Update the state with listings and their image URLs
            }
        }

        fetchListingsAndImages();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* New listings by people you follow */}
            <section className="my-8 mx-4">
                <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">New listings by people you follow</h2>
                <div className="flex justify-center overflow-x-scroll">
                    {listings.slice(0, 5).map(listing => (
                        <Card 
                            key={listing.id} 
                            itemId={listing.id}// Use the imageUrl or a default image
                            brand={listing.brand} 
                            size={listing.size} 
                            ownerId={listing.owner_id}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

// Card Component
interface CardProps {
    itemId: number;
    brand?: string;
    size?: string;
    ownerId: string;
}

const Card: React.FC<CardProps> = ({ brand, itemId, size, ownerId}) => {
    const router = useRouter(); // Initialize the router

    const handleCardClick = () => {
        // Navigate to the item page with the itemId as a query param
        router.push(`/item?itemId=${itemId}`);
    };


    return (
        <div className="flex flex-col justify-end p-2 relative" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="relative">
               
                <ItemImages itemId={itemId} /> 
                <ProfileImage userId={ownerId} />
            
            </div>
            <p className="mt-2 text-sm font-semibold">{brand}</p>
            <p className="text-xs text-gray-600">{size}</p>
        </div>
    );
};
