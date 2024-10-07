import React, { useState, useEffect } from "react";

const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose(); // Automatically close the modal after 3 seconds
      }, 3000);
  
      return () => clearTimeout(timer); // Clear timeout if the modal is closed manually
    }, [onClose]);
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 text-center">
          <h2 className="text-2xl font-bold mb-4">Success!</h2>
          <p>Your swap request has been successfully sent.</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default SuccessModal