import FrameCard from "@/components/cards/FrameCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchFrameById } from "@/lib/actions/frame.actions";

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
    </section>
    )
}

export default page;