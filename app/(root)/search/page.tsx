import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";

export default async function Page({ searchParams }: { searchParams: { search?: string } }) {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    const searchQuery = searchParams.search || "";
    const result = await fetchUsers({
        userId: user.id,
        searchString: searchQuery,
        pageNumber: 1,
        pageSize: 25
    });

    return (
        <section>
            <h1 className="head-text mb-10 ">Explore</h1>
            <section className="max-w-4xl mx-auto flex flex-col items-center">
            <form method="GET" action="/search" className="w-full flex items-center mb-10">
            <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search users or tags..."
                className="w-full flex-grow bg-dark-2 border text-slate-400 border-gray-500 focus:border-gray-500 p-2 rounded-l-lg"
            />
            <button
                type="submit"
                className="bg-primary-500 text-white p-2 rounded-r-lg">
                Search
            </button>
        </form>
            </section>
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No Users Found</p>
                ) : (
                    <>
                        {result.users.map((person: any) => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.name}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}
