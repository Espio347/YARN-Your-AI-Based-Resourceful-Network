import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import Summarizer from "@/components/forms/Summarizer";

async function Page() {
    const user = await currentUser();

    if(!user) return null;
    const userInfo = await fetchUser(user.id); 

    if(!userInfo?.onboarded) redirect('/onboarding');

    return (<>
             <h1 className="head-text">Loom - Content Summarizer</h1>
             <Summarizer/>
    </>)
}

export default Page;