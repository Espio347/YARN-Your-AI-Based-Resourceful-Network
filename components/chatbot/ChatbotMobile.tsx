"use client";
import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part, Content } from "@google/generative-ai";

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
}

const ChatHistory = ({ chatHistory }: { chatHistory: Message[] }) => {
    return (
        <div className="flex-1 overflow-y-auto py-4 mt-10 mb-4 custom-scrollbar">
            {chatHistory.map((message, index) => (
                <div key={index} className={`max-w-xs overflow-hidden ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                    <div className={`text-sm font-medium p-2 rounded-lg mb-2 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                        {message.role === 'user' ? 'You: ' : 'Fluffy: '}{message.content}
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

    const handleUserInput = async () => {
        if (userInput.trim() === "") return;

        setIsLoading(true);
        setChatHistory(prevChat => [
            ...prevChat,
            { role: 'user', content: userInput } as Message,
        ]);

        try {
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [...chatHistory, { role: 'user', content: userInput }].map(({ role, content }) => ({
                    role: role === 'assistant' ? 'model' : role,
                    parts: [{ text: content }] as Part[],
                })),
            });

            const result = await chatSession.sendMessage(userInput);

            const assistantMessage: Message = {
                role: 'assistant',
                content: result.response.text(),
            };

            setChatHistory(prevChat => [...prevChat, assistantMessage]);
        } catch (error) {
            console.error("Error:", error);
            setChatHistory(prevChat => [
                ...prevChat,
                { role: 'assistant', content: "Sorry, there was an error processing your request." } as Message,
            ]);
        }

        setUserInput('');
        setIsLoading(false);
    };

    return (
     <section className="custom-scrollbar">
        <section className=" h-screen flex flex-col bg-dark-2 p-4 shadow-md">
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
