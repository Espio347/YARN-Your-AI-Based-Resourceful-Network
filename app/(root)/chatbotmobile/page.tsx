import { currentUser } from "@clerk/nextjs";
import ChatbotMobile from "../../../components/chatbot/ChatbotMobile";

export default async function Home() {
  const user = await currentUser();

  return (
    <ChatbotMobile />
  )
}