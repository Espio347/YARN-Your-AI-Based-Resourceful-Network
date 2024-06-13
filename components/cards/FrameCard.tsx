// components/cards/FrameCard.tsx

import Image from "next/image";
import Link from "next/link";
import LikeButton from "@/app/(root)/LikeButton";
import ShareButton from "@/components/ShareButton";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    image: string;
    author: {
        name: string;
        image: string;
        id: string;
    }
    flock: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean;
    likes: string[];
}

const FrameCard = ({
    id,
    currentUserId,
    parentId,
    content,
    image,
    author,
    flock,
    createdAt,
    comments,
    isComment,
    likes = [],
}: Props) => {
    const isLiked = likes.includes(currentUserId);

    return (
        <article className={`flex x-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image
                                src={author.image}
                                alt="Profile image"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="frame-card_bar"/>
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>

                        {content && <p className="empty-2 text-small-regular text-light-2">{content}</p>}
                        {image && (
                            <div className="image-container">
                                <Image
                                    src={image}
                                    alt="Posted Image"
                                    width={500}
                                    height={500}
                                    className="posted-image"
                                />
                            </div>
                        )}
                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <LikeButton initialIsLiked={isLiked} />

                                <Link href={`/frame/${id}`}>
                                    <Image
                                        src="/assets/reply.svg"
                                        alt="reply"
                                        width={18}
                                        height={18}
                                        className="cursor-pointer object-contain"
                                    />
                                </Link>

                                <ShareButton postId={id} />
                            </div>

                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-11 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default FrameCard;
