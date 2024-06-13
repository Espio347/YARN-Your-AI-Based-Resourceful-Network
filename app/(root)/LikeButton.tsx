'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LikeButtonProps {
  initialIsLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ initialIsLiked }) => {
  const [liked, setLiked] = useState(initialIsLiked);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div onClick={handleLike} className="flex items-center cursor-pointer">
      <Image
        src={liked ? '/assets/heart.svg' : '/assets/heart-gray.svg'}
        alt="heart"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
  );
};

export default LikeButton;
