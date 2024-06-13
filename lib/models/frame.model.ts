// models/frame.model.ts

import mongoose from 'mongoose';

const frameSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flock'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Frame'
        }
    ],
    image: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    likeCount: {
        type: Number,
        default: 0
    }
});

const Frame = mongoose.models.Frame || mongoose.model('Frame', frameSchema);

export default Frame;
