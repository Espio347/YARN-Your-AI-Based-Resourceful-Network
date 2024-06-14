"use client";
import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

interface Message {
    role: "user" | "assistant";
    content: string;
    displayContent: string;  // New field for animated text
}

const infoBot = `You are to act like Fluffy the Sheep, a friendly assistant on the YARN platform. Fluffy is here to help users navigate the site, answer questions, and make their experience enjoyable. Whether they need help finding something or have questions about using a feature, they can ask Fluffy. Here's the layout for you to reference: Top Left - Home Button: Located at the top of the sidebar, clicking this button will take users to the Home page where they can see the latest posts. Sidebar (from Top to Bottom): Search: Just below the Home button. Users can use this to search for posts, users, or topics. Activity: Below Search. This section shows recent activity and interactions. Create: Located below Activity. Users can use this button to create a new post or content. Profile: Below Create. Clicking here allows users to view and edit their profile. Loom: Under Profile. This might be a section for special features or tools (more context needed). Logout: The last option on the sidebar, at the bottom. Users can use this to log out of their account. Main Content Area: Top Navigation Bar: At the top right corner, users can find their account icon with a dropdown for account settings. Feed: The central area of the Home page shows posts from users. Each post includes the user's name, profile picture, and their content. Message Box: Bottom Right Corner: There’s a message box labeled "Message Fluffy..." where users can type and send messages to Fluffy the Sheep. Example Instructions for Users: How to Create a Post: "To create a post, click on the 'Create' button located on the sidebar to the left, just below the 'Activity' section. This will take you to the post creation page where you can write and publish your content." How to Search for Posts: "To search for posts or users, click on the 'Search' button in the sidebar, which is the second option from the top. Type your query in the search bar and press Enter to see the results." How to Log Out: "To log out of your account, scroll to the bottom of the sidebar and click on the 'Logout' button. This will log you out and return you to the login page. You are to keep this in mind. Now here is the message from the user for you to respond:"`;

const ChatHistory = ({ chatHistory }: { chatHistory: Message[] }) => {
    return (
        <div className="flex-1 overflow-y-auto py-4 mt-10 mb-4 custom-scrollbar">
            {chatHistory.map((message, index) => (
                <div key={index} className={`max-w-xs overflow-hidden ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                    <div className={`text-sm font-medium p-2 rounded-lg mb-2 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                        {message.role === 'user' ? 'You: ' : 'Fluffy: '}
                        {message.role === 'user' ? message.content : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.displayContent}
                            </ReactMarkdown>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function Page() {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const animateText = (text: string, index: number) => {
        let i = 0;
        const interval = setInterval(() => {
            setChatHistory(prevChat => {
                const newChat = [...prevChat];
                newChat[index].displayContent = text.substring(0, i + 1);
                return newChat;
            });
            i++;
            if (i >= text.length) {
                clearInterval(interval);
            }
        }, 50); // Adjust the speed of the animation here
    };

    const handleUserInput = async () => {
        if (userInput.trim() === "") return;

        setIsLoading(true);
        setChatHistory(prevChat => [
            ...prevChat,
            { role: 'user', content: userInput, displayContent: userInput } as Message,
        ]);

        try {
            const concatenatedMessage = `${infoBot} ${userInput}`;
            
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [...chatHistory, { role: 'user', content: userInput }].map(({ role, content }) => ({
                    role: role === 'assistant' ? 'model' : role,
                    parts: [{ text: content }] as Part[],
                })),
            });

            const result = await chatSession.sendMessage(concatenatedMessage);

            const assistantMessage: Message = {
                role: 'assistant',
                content: await result.response.text(),
                displayContent: '',
            };

            setChatHistory(prevChat => {
                const newChat = [...prevChat, assistantMessage];
                animateText(assistantMessage.content, newChat.length - 1);
                return newChat;
            });
        } catch (error) {
            console.error("Error:", error);
            setChatHistory(prevChat => [
                ...prevChat,
                { role: 'assistant', content: "Sorry, there was an error processing your request.", displayContent: "Sorry, there was an error processing your request." } as Message,
            ]);
        }

        setUserInput('');
        setIsLoading(false);
    };

    return (
        <section className="custom-scrollbar max-lg:hidden">
            <section className="rightsidebar h-screen flex flex-col bg-dark-2 p-4 shadow-md">
                <ChatHistory chatHistory={chatHistory} />
                <div className="flex">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Message Fluffy..."
                        className="flex-grow bg-dark-2 mr-2 border text-slate-400 border-gray-500 focus:border-gray-500 p-2 rounded-lg"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleUserInput}
                        disabled={isLoading}
                        className="bg-primary-500 text-white p-2 rounded-lg"
                    >
                        {isLoading ? 'Loading...' : 'Send'}
                    </button>
                </div>
            </section>
        </section>
    );
}
