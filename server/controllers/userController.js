import UserModel from '../models/User.js';
import bcrypt from "bcrypt";//decryption and encryption
import jwt from 'jsonwebtoken';

class UserController {
    static userResgistration = async (req, res) => {
        try {
            const { name, email, role, password, password_confirmation } = req.body
            // console.log(name, email, role, password, password_confirmation);

            if (!name || !email || !password || !password_confirmation) {
                return res.status(400).send({ status: "bad request", message: "all fields are required" });
            }
            //to check if user is already registered by this email
            const user = await UserModel.findOne({ email: email })
            if (user) {
                return res.status(409).send({ status: "failed", message: "Email already exists" });
            }
            if (password.length < 6) {
                return res.status(400).send({ status: "bad request", message: "Password must be at least 6 characters" });
            }
            if (password !== password_confirmation) {
                return res.status(400).send({ status: "failed", message: "password and confirmation password do not match" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new UserModel({
                name: name,
                email: email,
                role: role,
                password: hashPassword,
            });
            const saved_user = await newUser.save();
            const token = jwt.sign({ userId: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            return res.status(201).send({ sataus: "success", message: " successfully registered", user: saved_user, token: token });
        }

        catch (error) {
            console.log(error);
            return res.status(500).send({ status: "failed", message: "Uable to register" });
        }
    }

    //login function
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).send({ status: "bad request", message: "all fields are required" });
            }

            const user = await UserModel.findOne({ email: email });

            // check if user not exist
            if (!user) {
                return res.status(404).send({ status: "failed", message: "You are not registered user" });
            }

            // check user password matches with database password
            const isMatch = await bcrypt.compare(password, user.password);

            if ((user.email === email) && isMatch) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                return res.status(200).send({ status: "success", message: "successfully logged in", token: token, user: user });
            }

            else {
                return res.status(404).send({ status: "failed", message: "email or password is incorrect" });
            }

        } catch (error) {
            return res.status(500).send({ status: "failed", message: "unable to login" });
        }
    }

    // change password
    static changePassword = async (req, res) => {
        try {
            const { password, password_confirmation } = req.body;
            if (!password || !password_confirmation) {
                return res.status(400).send({ status: "bad request", message: "all fields are required" });
            }
            if (password !== password_confirmation) {
                return res.status(403).send({ state: "failed", message: "Invalid password" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: hashPassword } });

            res.send({ state: "success", message: "Password changed successfully" });
        }
        catch (err) {
            return res.status(500).send({ status: "bad request", message: "internal server error" });
        }

    }
    static filterUser = async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(401).send({ status: "failed", message: 'Unauthorized User , User Have No Access To See User' })
            }
            const { name } = req.body
            console.log(name);
            
            const userList = await UserModel.find({name:{ $regex: name, $options: 'i' }});
            res.send({ state: "success", data: userList});
        }
        catch (err) {
            return res.status(500).send({ status: "bad request", message: "internal server error", err: err });
        }
    }

    static updateUser = async (req, res) => {
        try {
            const { role } = req.body
            if (req.user.role !== 'admin') {
                return res.status(401).send({ status: "failed", message: 'Unauthorized User , User Have No Access To Change' })
            }
            const id = req.params['id']
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,                // The user's _id (no need for { _id: id })
                { $set: { role: role } }, // The update operation (set the role to newRole)
                { new: true }      // Option to return the updated document
            );
            // const user = await UserModel.findOne({ _id: mongoose.Types.ObjectId(id) });
            console.log(updatedUser);
            res.send({ state: "success", message: "Role changed successfully" });
        }
        catch (err) {
            return res.status(500).send({ status: "bad request", message: "internal server error", err: err });
        }

    }
    static deleteUser = async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(401).send({ status: "failed", message: 'Unauthorized User , User Have No Access To Delete' })
            }
            const id = req.params['id']
            const deletedUser = await UserModel.findByIdAndDelete(id);

            // If no user is found (i.e., the returned value is null)
            if (!deletedUser) {
                return res.status(404).send({
                    status: "failed",
                    message: 'User Not Found'
                });
            }
            // const user = await UserModel.findOne({ _id: mongoose.Types.ObjectId(id) });
            res.status(200).send({
                state: "success",
                message: "User deleted successfully"
            });
        }
        catch (err) {
            res.status(500).send({
                status: "failed",
                message: 'An error occurred while deleting the user'
            });
        }

    }

    // get logged user details
    static loggedUser = async (req, res) => {
        return res.status(200).send({ status: "success", "user": req.user });
    }
}
export default UserController;