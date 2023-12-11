import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    currentUserId: string;
    author: {
        name: string;
        image: string;
        id: string;
    }
}

const suggestPeopleCard = ({
    id,
    currentUserId,
    author,
}: Props) => {
        return (
            <article className="flex flex-col items-center rounded-full bg-dark-4">
                <div className="flex items-center p-2">
                    <div className="flex flex-row gap-2">
                        <div className="flex items-center">
                            <Link href={`/profile/${author.id}`} className="relative h-12 w-12">
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
                            <Link href={`/profile/${author.id}`} >
                                <h4 className="p-3 cursor-pointer text-base-semibold text-light-1">
                                    {author.name}
                                </h4>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        )
}

export default suggestPeopleCard;