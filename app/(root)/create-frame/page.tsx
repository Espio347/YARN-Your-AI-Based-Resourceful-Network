import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostFrame  from "@/components/forms/PostFrame"

async function Page() {
    const user = await currentUser();

    if(!user) return null;
    const userInfo = await fetchUser(user.id); 

    if(!userInfo?.onboarded) redirect('/onboarding');

    return (<>
             <h1 className="head-text">Create Frame</h1>
             <PostFrame userId = {userInfo._id} />
    </>)
}

export default Page;