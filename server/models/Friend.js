import mongoose from "mongoose";

// Define the Blog Schema
const friendSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'user', // Name of the User model
        required: true,
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'user', // Name of the User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Blog Model
const FriendModel = mongoose.model("friend", friendSchema);

export default FriendModel;
