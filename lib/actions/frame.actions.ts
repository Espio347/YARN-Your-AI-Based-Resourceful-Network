"use server"

import { connectToDB } from "../mongoose"
import Frame from "../models/frame.model"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    flockId: string | null,
    path: string,
    image: string
}

export async function createFrame({ text, author, flockId, path, image }: Params & { image: string }) {
    try {
        connectToDB();

        const createdFrame = await Frame.create({
            text,
            author,
            community: flockId,
            image, 
        });

        // Update user
        await User.findByIdAndUpdate(author, {
            $push: { frames: createdFrame._id }
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating frame: ${error.message}`);
    }
}



export async function fetchFrames(pageNumber = 1, pageSize=1) {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const framesQuery = Frame.find({ parentId: {$in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User})
    .populate({ 
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalFramesCount = await Frame.countDocuments({parentId: {$in: [null, undefined]}})

    const frames = await framesQuery.exec();

    const isNext = totalFramesCount > skipAmount + frames.length;

    return {frames,isNext};
}

export async function fetchFrameById(id:string) {
    connectToDB();
    try {
        //TODO POPULATE FLOCK
        const frame = await Frame.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: '_id id name image'
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: '_id id name parentId image'
                },
                {
                    path: 'children',
                    model: Frame,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();

        return frame;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToFrame(
    frameId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB();
    try {
        const originalFrame = await Frame.findById(frameId);

        if(!originalFrame) {
            throw new Error("Oops! Frame not Found!")
        }

        const commentFrame = new Frame({
            text: commentText,
            author: userId,
            parentId: frameId
        })
        const savedCommentFrame = await commentFrame.save();
        originalFrame.children.push(savedCommentFrame._id);
        await originalFrame.save();
        revalidatePath(path);
    } catch (error: any) {
       throw new Error(`Error adding Comment: $(error.message)`) 
    }
}

export async function likeFrame(frameId: string, userId: string, path: string) {
    connectToDB();
    try {
        const frame = await Frame.findById(frameId);
        if (!frame) {
            throw new Error("Frame not found");
        }

        if (!frame.likes.includes(userId)) {
            frame.likes.push(userId);
            frame.likeCount += 1;
            await frame.save();
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error liking frame: ${error.message}`);
    }
}

export async function unlikeFrame(frameId: string, userId: string, path: string) {
    connectToDB();
    try {
        const frame = await Frame.findById(frameId);
        if (!frame) {
            throw new Error("Frame not found");
        }

        const index = frame.likes.indexOf(userId);
        if (index !== -1) {
            frame.likes.splice(index, 1);
            frame.likeCount -= 1;
            await frame.save();
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error unliking frame: ${error.message}`);
    }
}
