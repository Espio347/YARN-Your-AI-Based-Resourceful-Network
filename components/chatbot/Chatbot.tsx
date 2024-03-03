"use client"
import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

interface Message {
    role: "user" | "assistant"; // Update role to match the expected values
    content: string;
}

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

    const handleUserInput = async () => {
        setIsLoading(true);
        setChatHistory(prevChat => [
            ...prevChat,
            { role: 'user', content: userInput } as Message,
        ]);

        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: [...chatHistory, { role: 'user', content: userInput }],
                model: 'gpt-3.5-turbo',
            });

            const filteredMessages = chatCompletion.choices
                .filter(choice => choice.message.content !== null)
                .map(choice => ({ role: 'assistant', content: choice.message.content as string } as Message));

            setChatHistory(prevChat => [...prevChat, ...filteredMessages]);
        } catch (error) {
            console.error("Error:", error);
            // Handle error (e.g., display error message to user)
        }

        setUserInput('');
        setIsLoading(false);
    }

    return (
        <section className="">
            <section className="rightsidebar px-2 custom-scrollbar">
            <div className="flex flex-col h-screen  bg-dark-2 p-4 shadow-md">
                <div className="flex-1 object-center overflow-y-auto custom-scrollbar py-4 mt-10 mb-4" ref={chatHistoryRef}>
                    {/* Render chat history here */}
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`max-w-xs overflow-hidden ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                            <div className={`text-sm font-medium p-2 rounded-lg mb-2 ${message.role === 'user' ? 'text-white' : 'bg-primary-500 text-white'}`}>
                                {message.role === 'user' ? 'You: ' : 'Fluffy: '}{message.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Message Fluffy..."
                        className="flex-grow bg-dark-2 mr-2 border text-slate-400 border-gray-500 focus:border-gray-500 p-2 rounded-lg"
                    />
                    <button
                        onClick={handleUserInput}
                        disabled={isLoading}
                        className="bg-primary-500 text-white p-2 rounded-lg"
                    >
                        {isLoading ? 'Loading...' : 'Send'}
                    </button>
                </div>
            </div>
        </section>
        </section>
    );
}
