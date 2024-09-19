import React from 'react';

const ListAnItemPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white px-24 py-12">
            <h1 className="text-3xl font-bold mb-6">List an Item</h1>

            {/* Photos Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Photos</h2>
                <p className="text-gray-600 mb-4">
                    Add up to four photos in JPEG or PNG format. Try to make your photos clear, with any flaws clearly presented.
                </p>

                {/* Photo Upload Grid */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="border-dashed border-2 border-gray-300 rounded-lg h-60 flex items-center justify-center text-center">
                        <p>Add a photo</p>
                    </div>
                    <div className="border-dashed border-2 border-gray-300 rounded-lg h-60 flex items-center justify-center text-center">
                        <p>Cover photo</p>
                    </div>
                    <div className="border-dashed border-2 border-gray-300 rounded-lg h-60 flex items-center justify-center text-center">
                        <p>Front</p>
                    </div>
                    <div className="border-dashed border-2 border-gray-300 rounded-lg h-60 flex items-center justify-center text-center">
                        <p>Back</p>
                    </div>
                </div>

                {/* Add photos link */}
                <p className="text-blue-500 text-sm text-center cursor-pointer mb-4">
                    + Add photos from phone or tablet
                </p>

                {/* QR code section */}
                <div className="border border-gray-300 p-4 flex items-center justify-between rounded-lg">
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                        {/* Replace with actual QR code image */}
                        <img src="qr_code_placeholder.png" alt="QR Code" />
                    </div>
                    <div className="ml-4">
                        <p className="font-bold">Scan the QR code on the left</p>
                        <p>with your phone or tablet to easily add photos from another device.</p>
                        <button className="bg-gray-100 mt-2 px-4 py-1 rounded-md">Scan me!</button>
                    </div>
                </div>
            </section>

            {/* Title Input */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Title</h2>
                <input
                    type="text"
                    placeholder="e.g. Women's Long Sleeve Tee"
                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                />
            </section>

            {/* Description Input */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <textarea
                    placeholder="e.g. Stripey tee, only worn a few times."
                    className="w-full border border-gray-300 rounded-lg p-2 h-32 text-gray-700"
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
            </section>
        </div>
    );
};

export default ListAnItemPage;
