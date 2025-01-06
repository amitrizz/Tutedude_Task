import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const checkUserAuthorization = async (req, res, next) => {
    const { authorization } = req.headers;
    // console.log(authorization)
    if (!authorization) {
        return res.status(401).send({ status: "failed", message: 'Unauthorized User , No authorization token available' })
    }
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            //get token from headers
            const token = authorization.split(' ')[1]//at the 0th index has bearer and token present in the 1th index
            if (!token) {
                return res.status(401).send({ status: "failed", message: 'Unauthorized User , No token available' })
            }

            //verify token
            const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(userId);

            //get user from token
            req.user = await UserModel.findById(userId).select('-password')
            // console.log(req.user);
            if(!req.user.isAdmin){
                return res.status(401).send({ status: "failed", message: 'Unauthorized User For Manuplation Details' })
            }
            // console.log("update Auth done");
            next()
        }
        catch (err) {
            // console.log(err)
            res.status(401).send({ status: "failed", message: 'Unauthorized User' })
        }
    }

}


// export default checkUserAuth
export default checkUserAuthorization