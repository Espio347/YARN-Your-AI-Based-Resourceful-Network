interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
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
}

const FrameCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    flock,
    createdAt,
    comments
}: Props) => {
        return (
            <article>
                <h2 className="text-small-regular text-light-2"> 
                    {content}
                </h2>
            </article>
        )
}

export default FrameCard;