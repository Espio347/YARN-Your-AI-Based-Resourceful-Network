import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true , unique: true},
    name: { type: String, required: true },
    image: String,
    bio: String,
    frames: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Frame'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    flocks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flock'
        }
    ]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;