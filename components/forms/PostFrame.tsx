"use client"

import { useState, ChangeEvent } from 'react';
import { createFrame } from "@/lib/actions/frame.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useUploadThing } from "@/lib/validations/uploadthing"
import { isBase64Image } from "@/lib/utils"
import { FrameValidation } from '@/lib/validations/frame';
import { useRouter } from "next/navigation"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";

interface Props {
    userId: string;
}

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

function PostFrame({ userId }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm({
        resolver: zodResolver(FrameValidation),
        defaultValues: {
            frame: '',
            accountId: userId,
            image: "", 
        }
    });

    const generateParameter = 'List 3 Hashtags in the layout "#tag" (Only respond with tags separated with space) for: ';

    const handleImage = (e : ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if(e.target.files && e.target.files.length>0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if(!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                fieldChange(imageDataUrl);
            }
            fileReader.readAsDataURL(file);
        }
    }
    
    const onSubmit = async (values: z.infer<typeof FrameValidation>) => {
        const blob = values.image;

        const hasImageChanged = isBase64Image(blob);

        if(hasImageChanged) {
            const imgRes = await startUpload(files)
            if(imgRes && imgRes[0].url) {
                values.image = imgRes[0].url;
            }
        }
    
        const frameData = {
            text: values.frame,
            author: userId,
            flockId: null,
            path: "",
            image: values.image || ""
        };
    
        try {
            await createFrame(frameData);
            router.push("/");
        } catch (error) {
            console.error('Error creating frame:', error);
        }
    };

    const handleGenerateHashtags = async () => {
        setIsGenerating(true);
        try {
            const chatSession = await model.startChat({
                generationConfig,
                safetySettings,
                history: [{ role: 'user', content: generateParameter  + form.getValues('frame') }].map(({ role, content }) => ({
                    role: role === 'assistant' ? 'model' : role,
                    parts: [{ text: content }] as Part[],
                })),
            });

            const result = await chatSession.sendMessage(form.getValues('frame'));
            const hashtags = await result.response.text();

            form.setValue('frame', form.getValues('frame') + '\n' + hashtags);
        } catch (error) {
            console.error("Error generating hashtags:", error);
        }
        setIsGenerating(false);
    };
    
    // Function to convert File to Data URL
    const convertFileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                                    rows={15}
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
                    name="image"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="frame-form_image-label">
                                {field.value}
                            </FormLabel>
    
                            <FormControl className="flex-1 text-base-semibold text-gray-200">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    placeholder="Upload a Photo"
                                    className="account-form_image-input"
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="button" className="bg-secondary-500 mt-4" onClick={handleGenerateHashtags} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate HashTags'}
                </Button>
                <Button type="submit" className="bg-primary-500">
                    Post Frame
                </Button>
            </form>
        </Form>
    )
}

export default PostFrame;
