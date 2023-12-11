"use client"

import { addCommentToFrame, createFrame } from "@/lib/actions/frame.actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { start } from "repl"
import { usePathname, useRouter } from "next/navigation"

// import { updateUser } from "@/lib/actions/user.actions"
import { CommentValidation } from '@/lib/validations/frame';
import Image from "next/image"
import { threadId } from "worker_threads"

interface Props {
    frameId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({frameId, currentUserImg, currentUserId} :
    Props) => {
        const router = useRouter();
        const pathname = usePathname();
        const form = useForm({
            resolver: zodResolver(CommentValidation),
            defaultValues: {
               frame: ''
            }
        })
    
        const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
            await addCommentToFrame(
                frameId,
                values.frame,
                JSON.parse(currentUserId),
                pathname
                );

                form.reset();
    
            router.push("/")
        }
    return (
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
        >

        <FormField
            control={form.control}
            name="frame"
            render={({ field }) => (
              <FormItem className="flex gap-3 items-center w-full">
                
                <FormLabel>
                    <Image
                     src={currentUserImg}
                     alt="Profile Picture"
                     width={48}
                     height={48}
                     className="rounded-full object-cover"
                    />
                </FormLabel>

                <FormControl className="no-focus border border-none bg-transparent text-light-1">
                  <Input
                  type="text"
                  placeholder="Type your Comment here"
                  className="text-light-1 outline-none no-focus"
                  {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
            <Button type="submit"
            className="bg-primary-500 comment-form_btn">
                Comment
            </Button>
        </form>
        </Form>
    )
}

export default Comment;