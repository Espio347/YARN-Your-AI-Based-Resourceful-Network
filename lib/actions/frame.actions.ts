"use server"

import { connectToDB } from "../mongoose"
import Frame from "../models/frame.model"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    flockId: string | null,
    path: string
}

export async function createFrame({text, author, flockId, path}: Params) {
    try {
        connectToDB();

    const createdFrame = await Frame.create({
        text,
        author,
        flock: null
    });

    //update user
    await User.findByIdAndUpdate(author, {
        $push: { frames: createdFrame._id}
    })

    revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating frame: ${error.message}`)
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