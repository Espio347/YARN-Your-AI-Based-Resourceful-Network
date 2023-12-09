import * as z from 'zod';

export const FrameValidation = z.object({
    frame: z.string().min(3, {message: 'Minimum 3 Characters'}),
    accountId: z.string(),
})

export const CommentValidation = z.object({
    frame: z.string().min(3, {message: 'Minimum 3 Characters'}),
})