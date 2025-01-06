import FriendModel from '../models/Friend.js';
import UserModel from '../models/User.js';
import FriendRequestModel from '../models/FriendRequest.js'
import mongoose from 'mongoose';


class FriendController {
    static loadUser = async (req, res, next) => {
        try {
            const noOfPage = 20;
            let { skip } = req.body;
            if (!skip) {
                skip = 1;
            }
            const nextResult = (skip - 1) * noOfPage
            // console.log(skip);
            const results = await FriendModel.find().skip(nextResult).limit(noOfPage);
            // console.log(results);
            res.send({ data: "data", data: results });

        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
            // res.redirect("/error")
            // return res.status(500).send({ status: "failed", message: "Uable to register" });
        }
    }
    static getUser = async (req, res, next) => {
        try {
            // console.log(skip);
            const userid = req.user._id;

            // Step 1: Get the list of friends' IDs
            const friends = await FriendModel.find({ userid: userid }).select('friend');
            const friendsId = friends.map(friend => friend.friend); // Extract friend IDs

            // Step 2: Query to exclude the current user and friends
            const results = await UserModel.find({
                _id: { $nin: [userid, ...friendsId] } // Exclude current user and friends
            }).limit(8);
            // console.log(results);
            res.send({ status: "Fetch All User Data", result: results });
        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
        }
    }
    static getSearchByString = async (req, res, next) => {
        try {
            try {
                const userid = req.user._id;
                const str = req.params.str; // This is still unused, you may want to apply it to filter users by name, email, etc.

                // Step 1: Get the list of friends' IDs
                const friends = await FriendModel.find({ userid: userid }).select('friend');
                const friendsId = friends.map(friend => friend.friend); // Extract friend IDs

                // Step 2: Build the query to exclude the current user and friends, and apply search filtering if 'str' is provided
                const query = {
                    _id: { $nin: [userid, ...friendsId] } // Exclude current user and friends
                };

                if (str) {
                    query.$or = [
                        { name: { $regex: str, $options: 'i' } }, // Search by name (case-insensitive)
                        { email: { $regex: str, $options: 'i' } } // Search by email (case-insensitive)
                    ];
                }

                // Optional: Pagination (if needed)
                const skip = 0; // You can replace 0 with the dynamic value for pagination
                const limit = 8;

                const results = await UserModel.find(query)
                    .skip(skip) // Use skip for pagination
                    .limit(limit); // Limit the number of results

                // Send the results
                res.send({ status: "Fetch All User Data", result: results });

            } catch (error) {
                console.log(error);
                res.status(500).send({ error: "Internal Server Error" });
            }

        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
        }
    }

    static getFriendList = async (req, res, next) => {
        try {
            const userid = req.user._id;
            const results = await FriendModel.find(
                { userid: userid }
            ).populate({
                path: 'friend', // Populate the 'friend' field
                select: '_id name email', // Select only 'id', 'name', and 'email' from the User table
            });
            // console.log(results);

            res.send({ status: "All Friend List", result: results });
        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
        }
    }
    static getFriendRequestList = async (req, res, next) => {
        try {
            const userid = req.user._id;
            const results = await FriendRequestModel.find(
                { receiver: userid, state: 'pending' }
            ).populate({
                path: 'sender', // Populate the 'friend' field
                select: '_id name email', // Select only 'id', 'name', and 'email' from the User table
            });
            res.send({ status: "All Requested List List", result: results });
        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
        }
    }
    static sendRequest = async (req, res) => {
        try {
            const senderId = req.user._id;
            const receiverId = req.params.id;

            // Check if a friend request already exists
            const existingRequest = await FriendRequestModel.findOne({
                sender: senderId,
                receiver: receiverId,
            });

            if (!existingRequest) {
                // Create a new friend request only if it doesn't already exist
                const sendData = new FriendRequestModel({
                    sender: senderId,
                    receiver: receiverId,
                });
                const send = await sendData.save();

                res.send({ status: "Request Sent Successfully", result: send });
            } else {
                // If a request already exists, respond with a message
                res.status(400).send({ message: "Friend request already sent!" });
            }


        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
            // res.redirect("/error")
            // return res.status(500).send({ status: "failed", message: "Uable to register" });
        }
    }
    static sendRequestUpdate = async (req, res, next) => {
        try {
            const receiverId = req.user._id;
            const senderId = req.params.id;
            const { state } = req.body;

            if (state === 'accept') {
                // Check if the friendship already exists (receiver -> sender)
                const existingFriendship1 = await FriendModel.findOne({
                    userid: receiverId,
                    friend: senderId,
                });

                // Check if the friendship already exists (sender -> receiver)
                const existingFriendship2 = await FriendModel.findOne({
                    userid: senderId,
                    friend: receiverId,
                });

                // Add friendships only if they don't already exist
                if (!existingFriendship1) {
                    const sendData1 = new FriendModel({
                        userid: receiverId,
                        friend: senderId,
                    });
                    await sendData1.save();
                }

                if (!existingFriendship2) {
                    const sendData2 = new FriendModel({
                        userid: senderId,
                        friend: receiverId,
                    });
                    await sendData2.save();
                }
            }

            // Update the friend request state
            const actionRequest = await FriendRequestModel.findOneAndDelete(
                {
                    sender: senderId,
                    receiver: receiverId,
                }
            )

            res.send({ status: "Friendship updated successfully", result: actionRequest });


        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
            // res.redirect("/error")
            // return res.status(500).send({ status: "failed", message: "Uable to register" });
        }
    }
    static removeFriend = async (req, res, next) => {
        try {
            const userid = req.user._id;
            const friendId = req.params.id;

            let results = await FriendModel.findOneAndDelete(
                {
                    userid: userid,
                    friend: friendId,
                }
            );
            results = await FriendModel.findOneAndDelete(
                {
                    userid: friendId,
                    friend: userid,
                }
            );
            res.send({ status: "Friend Remove Successfully", result: results });

        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
            // res.redirect("/error")
            // return res.status(500).send({ status: "failed", message: "Uable to register" });
        }
    }
    static mutualConnection = async (req, res, next) => {
        try {
            const userid = req.user._id;

            // Get the friends of the current user
            const friend_ids = await FriendModel.find({ userid: userid }).select('friend');
            const friendIdList = friend_ids.map(id => id.friend); // Extract friend IDs from the user
            friendIdList.push(userid);

            // console.log(friendIdList);

            let mutualConnection = [];

            // Iterate over each friend in the friend list
            for (const friendId of friendIdList) {
                // Get the friends of each friend, excluding the user's current friends
                const friendOfFriend = await FriendModel.find({
                    userid: friendId,
                    friend: { $nin: friendIdList } // Exclude mutual friends
                }).select('friend'); // Only select the 'friend' field

                // Extract just the 'friend' IDs from the friendOfFriend result
                mutualConnection.push(...friendOfFriend.map(friend => friend.friend));
            }

            // Now find the mutual connections by checking if they exist in the mutualConnection list
            const friendOfFriendList = await FriendModel.find({
                friend: { $in: mutualConnection } // Check if friend exists in mutualConnection list
            }).populate({
                path: 'friend', // Populate the 'friend' field
                select: '_id name email', // Select only 'id', 'name', and 'email' from the User table
            }).populate({
                path: 'userid', // Populate the 'friend' field
                select: '_id name email', // Select only 'id', 'name', and 'email' from the User table
            });

            res.send({ status: "Mutual Connection Friend List", result: friendOfFriendList });

        } catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" });
        }

    }
    static friendFriends = async (req, res, next) => {
        try {
            const userid = req.user._id;

            // Get the friends of the current user
            const friend_ids = await FriendModel.find({ userid: userid }).select('friend');
            const friendIdList = friend_ids.map(id => id.friend); // Extract friend IDs from the user
            console.log(friendIdList);
            friendIdList.push(userid);

            let mutualConnection = [];

            // Iterate over each friend in the friend list
            for (const friendId of friendIdList) {
                // Get the friends of each friend, excluding the user's current friends
                const friendOfFriend = await FriendModel.find({
                    userid: friendId,
                    friend: { $nin: friendIdList } // Exclude mutual friends
                }).populate({
                    path: 'friend', // Populate the 'friend' field
                    select: '_id name email', // Select only 'id', 'name', and 'email' from the User table
                });
                // Extract just the 'friend' IDs from the friendOfFriend result
                if (friendOfFriend.length > 0) {
                    for (const ff of friendOfFriend) {
                        mutualConnection.push(ff);
                    }
                }
            }
            console.log(mutualConnection);


            res.send({ status: "Friends Friend List", result: mutualConnection });

        }
        catch (error) {
            console.log(error);
            res.send({ error: "Internal Server Error" })
            // res.redirect("/error")
            // return res.status(500).send({ status: "failed", message: "Uable to register" });
        }
    }

}
export default FriendController;