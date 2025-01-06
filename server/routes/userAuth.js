import express from 'express';
const userAuth = express.Router();
import userController from '../controllers/userController.js';

import checkUserAuthentication from '../middleware/auth-checkAuthentication.js'



//public routes
userAuth.post('/register', userController.userResgistration);
userAuth.post('/login', userController.userLogin);

userAuth.post('/filter-users',checkUserAuthentication,userController.filterUser);
userAuth.get('/logged-user',checkUserAuthentication,userController.loggedUser);
userAuth.put('/update-user/:id',checkUserAuthentication,userController.updateUser);

// admin routes
userAuth.delete('/delete-user/:id',checkUserAuthentication, userController.deleteUser);





export default userAuth;