import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/loginSignup/Login";
import Signup from "./components/loginSignup/Signup";
import UserProfile from "./components/DashBoard/UserProfile";
import FriendList from "./components/DashBoard/FriendList";
import FriendRequestList from "./components/DashBoard/FriendRequestList";
import Navbar from "./components/Navbar";

// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

function App() {


  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<UserProfile />} ></Route>
        <Route path="/login" element={<Login />}  ></Route>
        <Route path="/register" element={<Signup />}></Route>
        {/* <Route path="/profile" element={<UserProfile />} /> */}
        <Route path="/friend-list" element={< FriendList/>} />
        <Route path="/friend-request-list" element={<FriendRequestList />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
