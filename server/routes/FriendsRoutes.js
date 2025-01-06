import express from 'express';
const friendrouter = express.Router();
import FriendController from '../controllers/FriendController.js';
import checkUserAuthentication from '../middleware/auth-checkAuthentication.js'


//public routes
friendrouter.get('/',checkUserAuthentication, FriendController.getUser);
friendrouter.get('/friend-list',checkUserAuthentication, FriendController.getFriendList);
friendrouter.get('/friend-request-list',checkUserAuthentication, FriendController.getFriendRequestList);
friendrouter.get('/search/:str',checkUserAuthentication, FriendController.getSearchByString);
friendrouter.post('/send-request/:id',checkUserAuthentication, FriendController.sendRequest);
friendrouter.patch('/send-request-update/:id',checkUserAuthentication, FriendController.sendRequestUpdate);
friendrouter.delete('/remove-friend/:id',checkUserAuthentication, FriendController.removeFriend);

friendrouter.get('/mutual-connection', checkUserAuthentication,FriendController.mutualConnection);
friendrouter.get('/friend-friends', checkUserAuthentication,FriendController.friendFriends);




export default friendrouter;