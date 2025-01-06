import mongoose from "mongoose";

// Define the Blog Schema
const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'user', // Name of the User model
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'user', // Name of the User model
        required: true,
    },
    state: {
        type: String,
        enum: ['pending', 'accept','reject'], // Ensure only these roles can be assigned
        required: true,
        default: 'pending', // Default role is 'user' if none is provided
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Blog Model
const FriendRequestModel = mongoose.model("friend-request", friendRequestSchema);

export default FriendRequestModel;
