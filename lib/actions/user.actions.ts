"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Frame from "../models/frame.model";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}

export async function updateUser(
    {userId,
    username,
    name,
    bio,
    image,
    path}: Params
    ): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            {id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
                {upsert: true}
            );
    
            if(path === '/profile/edit') {
                revalidatePath(path);
            }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        await connectToDB();
        return await User.findOne({ id: userId });
        //To-Do Populate Communities
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function  fetchUserPosts(userId: string) {
    try {
        connectToDB();
        //TO-DO Populate Community
        const frames = await User.findOne({id:userId}).populate(
            {
                path: 'frames',
                model: Frame,
                populate: {
                    path: 'children',
                    model: Frame,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            }
        )
        return frames;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}