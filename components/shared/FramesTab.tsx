import { fetchUserPosts } from "@/lib/actions/user.actions";
import FrameCard from "../cards/FrameCard";
import { redirect } from 'next/navigation';
import { threadId } from "worker_threads";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const FramesTab = async ({currentUserId, accountId, accountType}: Props) => {

    let result = await fetchUserPosts(accountId);

    if(!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.frames.map((frame: any) => (
             <FrameCard 
             key={frame._id}
             id={frame._id}
             currentUserId={currentUserId}
             parentId={frame.parentId}
             content={frame.text}
             author={accountType === 'User'
             ? {name: result.name, image: result.image, id: result.id}
             : {name: frame.author.name, image: frame.author.image, id: frame.author.id}} //todo update
             flock={frame.flock} //todo update
             createdAt={frame.createdAt}
             comments={frame.children}
            />
            ))}
        </section>
    )
}

export default FramesTab;