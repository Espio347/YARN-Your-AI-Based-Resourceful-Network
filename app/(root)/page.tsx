import { fetchFrames } from "@/lib/actions/frame.actions";
import { currentUser } from "@clerk/nextjs";
import FrameCard from "@/components/cards/FrameCard";

export default async function Home() {
  const result = await fetchFrames(1,20);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.frames.length === 0? (
          <p className="no-result">It's Quiet for Now</p>
        ): (
          <>
           {result.frames.map((frame) => (
            <FrameCard 
              key={frame._id}
              id={frame._id}
              currentUserId={user?.id || ""}
              parentId={frame.parentId}
              content={frame.text}
              author={frame.author}
              image={frame.image}
              flock={frame.flock}
              createdAt={frame.createdAt}
              comments={frame.children}
            />
           ))}
          </>
        )}
      </section>
    </>
  )
}