import React, { useEffect, useState } from 'react';
import { getUserProfileImageUrl } from '../../service/items'; // Import your existing service function

interface ProfileImageProps {
  userId: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ userId }) => {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const profilePicBlob = await getUserProfileImageUrl(userId);

        if (profilePicBlob) {
          const imageUrl = URL.createObjectURL(profilePicBlob); // Create a URL for the Blob object
          setProfilePicUrl(imageUrl);
        } else {
          setProfilePicUrl(null); // No image available
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setProfilePicUrl(null); // Handle any error by not displaying the image
      }

      setLoading(false);
    };

    fetchProfileImage();
  }, [userId]);

  if (loading) {
    return <p>Loading profile picture...</p>;
  }

  return (
    <div>
      {profilePicUrl ? (
        <img
          src={profilePicUrl}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
          No Image
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
