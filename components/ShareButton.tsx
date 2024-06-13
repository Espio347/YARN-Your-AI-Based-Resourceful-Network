// components/ShareButton.tsx
"use client"

import React from "react";
import Image from "next/image";

const ShareButton = ({ postId }: { postId: string }) => {
    const handleShareClick = () => {
        const postLink = `${window.location.origin}/frame/${postId}`;
        navigator.clipboard.writeText(postLink)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch((error) => {
                console.error('Failed to copy link: ', error);
            });
    };

    return (
        <Image 
            src="/assets/share.svg" 
            alt="share"
            width={18}
            height={18}
            className="cursor-pointer object-contain"
            onClick={handleShareClick}
        />
    );
}

export default ShareButton;
