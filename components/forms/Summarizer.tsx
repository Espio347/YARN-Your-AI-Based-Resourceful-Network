"use client"

import React, { useState, useEffect } from 'react';
import { MdContentCopy } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";

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

const FrameValidation = z.object({
    frame: z.string().min(1, "Content is required"),
    summarizeParameter: z.string().optional(),
});

function Summarizer() {
    const [isLoading, setIsLoading] = useState(false);
    const [summarizedContent, setSummarizedContent] = useState('');
    const form = useForm({
        resolver: zodResolver(FrameValidation),
        defaultValues: {
            frame: '',
            summarizeParameter: 'Summarize this and give result in plain text without formatting ',
        }
    });

    const handleSummarize = async (values: z.infer<typeof FrameValidation>) => {
        setIsLoading(true);
        try {
            const chatSession = await model.startChat({
                generationConfig,
                safetySettings,
                history: [{ role: 'user', content: values.summarizeParameter + values.frame }].map(({ role, content }) => ({
                    role: role === 'assistant' ? 'model' : role,
                    parts: [{ text: content }] as Part[],
                })),
            });

            const result = await chatSession.sendMessage(values.frame);
            const summarizedText = await result.response.text();

            setSummarizedContent(summarizedText);
            form.setValue('frame', ''); // Clearing text area content
        } catch (error) {
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(summarizedContent);
    };

    return (
        <Form {...form}>
            {summarizedContent && (
                <div className="mt-6 p-4 border border-dark-4 bg-dark-3 text-light-1 relative ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summarizedContent}
                    </ReactMarkdown>
                    <div className='flex items-end'>
                    <Button
                        onClick={handleCopyToClipboard}
                        className="relative top-0 right-0 bg-primary-500 text-white px-4 py-2 rounded-xl"
                    >
                      <MdContentCopy size={16} color="#FFF" />
                    </Button>
                    </div>      
                </div>
            )}
            <form
                onSubmit={form.handleSubmit(handleSummarize)}
                className="mt-10 flex flex-col justify-start gap-10"
            >
                <FormField
                    control={form.control}
                    name="frame"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Content
                            </FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea
                                    rows={8}
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="summarizeParameter"
                    render={({ field }) =>
                        (
                            <FormItem className="hidden">
                                <FormControl>
                                    <Input type="hidden" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="bg-primary-500" disabled={isLoading}>
                        {isLoading ? 'Summarizing...' : 'Summarize'}
                    </Button>
                </form>
            </Form>
        );
    }
    
    export default Summarizer;
    