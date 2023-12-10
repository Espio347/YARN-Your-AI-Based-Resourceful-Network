import { SignIn } from "@clerk/nextjs";

const styles = {
  minHeight: "100vh", // Set minimum height to cover the entire viewport
  backgroundImage: "url('/assets/backsign.png')",
  backgroundSize: "cover",
};

const textShadowStyle = {
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Adding a text shadow effect
};

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-8 p-8" style={styles}>
      <h1 className="head-text text-center text-4xl font-semibold" style={textShadowStyle}>
        Welcome to YARN
      </h1>
      <SignIn />
    </div>
  );
}
