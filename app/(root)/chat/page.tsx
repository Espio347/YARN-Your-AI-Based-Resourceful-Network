"use client"
import React, { useState } from "react";
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
        <div className="main-container min-h-screen flex flex-col justify-center items-center">
            <div className="w-full max-w-screen-md mg-white p-4 rounded-lg shadow-md text-white">
                {/* Render chat history here */}
                {chatHistory.map((message, index) => (
                    <div key={index}>
                        {message.role === 'user' ? 'You: ' : 'Fluffy: '}{message.content}
                    </div>
                ))}
                <div className="flex">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-grow mr-2 border border-gray-400 p-2 rounded-lg"
                    />
                    <button
                        onClick={handleUserInput}
                        disabled={isLoading}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                        {isLoading ? 'Loading...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}
