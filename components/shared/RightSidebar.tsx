import { fetchFrames } from "@/lib/actions/frame.actions";
import { currentUser } from "@clerk/nextjs";
import SuggestPeopleCard from "../cards/SuggestPeopleCard";

export default async function RightSidebar() {
  const result = await fetchFrames(1, 5);
  const user = await currentUser();

  // Remove duplicate suggested people based on 'id' and exclude current user
  const uniqueSuggestedPeople = result.frames.reduce((acc, frame) => {
    const existingFrame = acc.find(
      (item) => item.author.id === frame.author.id || user?.id === frame.author.id
    );
    if (!existingFrame && user?.id !== frame.author.id) {
      acc.push(frame);
    }
    return acc;
  }, []);

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Flocks</h3>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested People</h3>
        <section className="mt-9 flex flex-col gap-10">
          {uniqueSuggestedPeople.length === 0 ? (
            <p className="no-result">It's Quiet for Now</p>
          ) : (
            <>
              {uniqueSuggestedPeople.map((frame) => (
                <SuggestPeopleCard
                  key={frame._id}
                  id={frame._id}
                  currentUserId={user?.id || ""}
                  author={frame.author}
                />
              ))}
            </>
          )}
        </section>
      </div>
    </section>
  );
}
