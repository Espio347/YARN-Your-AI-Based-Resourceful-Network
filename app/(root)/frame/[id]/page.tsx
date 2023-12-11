import FrameCard from "@/components/cards/FrameCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchFrameById } from "@/lib/actions/frame.actions";
import Comment from "@/components/forms/Comment";
import { threadId } from "worker_threads";

const page = async ({params}: { params: {id: string}}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const frame = await fetchFrameById(params.id); 

    return (
        <section className="relative">
        <div>
        <FrameCard 
         key={frame._id}
         id={frame._id}
         currentUserId={user?.id || ""}
         parentId={frame.parentId}
         content={frame.text}
         author={frame.author}
         flock={frame.flock}
         createdAt={frame.createdAt}
         comments={frame.children}
        />
        </div>

        <div className="mt-7">
            <Comment
                frameId={frame.id}
                currentUserImg={userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}
            />
        </div>
        <div className="mt-10">
            {frame.children.map((childItem: any) => (
                <FrameCard 
                key={childItem._id}
                id={childItem._id}
                currentUserId={user?.id || ""}
                parentId={childItem.parentId}
                content={childItem.text}
                author={childItem.author}
                flock={childItem.flock}
                createdAt={childItem.createdAt}
                comments={childItem.children}
                isComment
               />
            ))}
        </div>
    </section>
    )
}

export default page;