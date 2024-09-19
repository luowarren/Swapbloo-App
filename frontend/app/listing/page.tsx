"use client";

import React, { useState } from 'react';

const ListAnItemPage: React.FC = () => {
    const [photos, setPhotos] = useState<string[]>(['', '', '', '']);

    // Handle file input and preview the selected photo
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                const updatedPhotos = [...photos];
                updatedPhotos[index] = reader.result as string;
                setPhotos(updatedPhotos);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    return (
        <div className="min-h-screen bg-white px-64 py-12">
            <h1 className="text-3xl font-bold mb-6">List an Item</h1>
            <hr className="border-gray-300"></hr>

            {/* Photos Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2 mt-4">Photos</h2>
                <p className="text-gray-600 mb-4">
                    Add up to four photos in JPEG or PNG format. Try to make your photos clear, with any flaws clearly presented.
                </p>

                {/* Photo Upload Grid */}
                <div className="grid grid-cols-4 gap-4 h-40 mb-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative">
                            {/* Image preview or add button */}
                            <label className="border-dashed border-2 border-gray-300 rounded-lg h-40 w-full flex items-center justify-center cursor-pointer">
                                {photo ? (
                                    <img src={photo} alt={`Uploaded ${index}`} className="h-full w-full object-cover rounded-lg" />
                                ) : (
                                    <span>Add a photo</span>
                                )}
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handlePhotoChange(e, index)}
                                />
                            </label>
                        </div>
                    ))}
                </div>

                {/* Add photos link */}
                <p className="text-blue-500 text-sm text-center cursor-pointer mb-4">
                    + Add photos from phone or tablet
                </p>

                {/* QR code section */}
                <div className="border border-gray-300 p-4 flex items-center justify-center space-x-20 rounded-lg">
                    <div className="w-24 flex flex-col items-center">
                        <img src="qr.svg" alt="QR Code" />
                        <p>Scan me!</p>
                    </div>
                    <div className="ml-4 w-1/2">
                        <p className=""><strong>Scan</strong> the QR code on the left with your phone or tablet to easily add photos from another device.</p>
                    </div>
                </div>
            </section>

            {/* Title */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Title</h2>
                <input
                    type="text"
                    placeholder="e.g. Women's Long Sleeve Tee"
                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                />
            </section>

            {/* Description */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <textarea
                    placeholder="e.g. Stripey tee, only worn a few times."
                    className="w-full border border-gray-300 rounded-lg p-2 h-32 text-gray-700"
                />
            </section>

            {/* Damage/flaws */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Damage/Flaws Summary</h2>
                <textarea
                    placeholder="e.g. Stain on left sleeve."
                    className="w-full border border-gray-300 rounded-lg p-2 h-22 text-gray-700"
                />
            </section>

            {/* Info Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Info</h2>
                <label className="block text-gray-600 mb-2">Category</label>
                <input
                    type="text"
                    placeholder="e.g. Women's Long Sleeve Tee"
                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                />

                <label className="block mt-8 text-gray-600 mb-2">Brand</label>
                <input
                    type="text"
                    placeholder="Brand"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <label className="block mt-8 text-gray-600 mb-2">Condition</label>
                <input
                    type="text"
                    placeholder="Condition"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <label className="block mt-8 text-gray-600 mb-2">Size</label>
                <select
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option>Select Size</option>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                </select>
            </section>

            {/* Meetup Location Preferences Section */}
            < div className="mt-8" >
                <h2 className="text-lg font-bold">Meetup Location Preferences</h2>
                <div className="flex space-x-4 mt-4">
                    {/* Location Card 1 */}
                    <div className="bg-white border border-gray-300 rounded-md p-4 flex items-center justify-between w-1/2">
                        <div className="flex items-center space-x-2">
                            <div className="w-28 h-24 bg-green-300 rounded-md flex-shrink-0"></div>
                            <div className="flex-grow">
                                <h3 className="font-bold">UQ Union Building</h3>
                                <p className="text-sm text-gray-500">Union Complex, St Lucia QLD 4067</p>
                            </div>
                        </div>
                        <button className="font-bold">-</button>
                    </div>

                    {/* Location Card 2 */}
                    <div className="bg-white border border-gray-300 rounded-md p-4 flex items-center justify-between w-1/2">
                        <div className="flex items-center space-x-2">
                            <div className="w-28 h-24 bg-green-300 rounded-md flex-shrink-0"></div>
                            <div className="flex-grow">
                                <h3 className="font-bold">Sunnybank Hills Park</h3>
                                <p className="text-sm text-gray-500">Corner of Calam, 661 Compton Rd, Sunnybank Hills QLD 4109</p>
                            </div>
                        </div>
                        <button className="font-bold">-</button>
                    </div>
                </div>

                {/* Add new location button */}
                <div className="flex justify-center mt-6">
                    <button className="text-indigo-800 w-full font-bold px-6 py-2 border border-indigo-800 rounded-md">
                        Add new preferred meetup location
                    </button>
                </div>

                <div className="flex justify-center mt-6">
                    <button className="bg-indigo-700 text-white px-6 py-2 rounded-md mb-4">
                        List Item
                    </button>
                </div>
            </div >
        </div>
    );
};

export default ListAnItemPage;
