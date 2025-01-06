import axios from "axios"
import "../DashBoardCSS/UserProfile.css"
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserProfile() {
    const token = localStorage.getItem("token");
    const [users, setUsers] = useState(null);
    const [mutualUsers, setMutualUsers] = useState(null);
    const [friendsFriend, setFriendsFriend] = useState(null);
    const [isloading, setIsloading] = React.useState(false);
    const navigate = useNavigate();
    const [searchString, setSearchString] = useState("");

    const fetchUserDetails = async () => {
        try {
            setIsloading(true);
            if (!token) {
                navigate("/login");
            }
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/friend`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to the Authorization header
                    },
                }
            );

            const mutualUsers = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/friend/mutual-connection`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to the Authorization header
                    },
                }
            );
            const friendsfriend = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/friend//friend-friends`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to the Authorization header
                    },
                }
            );
            if (!res) {
                navigate("/login");
            }
            console.log("Friends Friend Data", friendsfriend);

            setFriendsFriend(friendsfriend.data.result)
            setMutualUsers(mutualUsers.data.result)
            setUsers(res.data.result)

        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Login failed!');
            } else {
                toast.error('An unexpected error occurred!');
            }
        } finally {
            setIsloading(false);
        }
    };


    useEffect(() => {

        fetchUserDetails(); // Call the async function
    }, []); // Depend on blog so it runs when b

    const handleSendRequest = async (receiverId) => {
        try {
            setIsloading(true);

            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/friend/send-request/${receiverId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to the Authorization header
                    },
                }
            );
            if (!res) {
                navigate("/login");
            }
            toast.success("Friend Request Sent Successfully")
            console.log(res);
            // setUsers(res.data.result);
            fetchUserDetails();


        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Login failed!');
            } else {
                toast.error('An unexpected error occurred!');
            }
        } finally {
            setIsloading(false);
        }
    }

    const searchByString = async (str) => {
        try {
            setIsloading(true);

            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/friend/search/${searchString}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token to the Authorization header
                    },
                }
            );
            if (!res) {
                navigate("/login");
            }
            // toast.success("Friend Request Sent Successfully")
            console.log(res);
            setUsers(res.data.result);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Login failed!');
            } else {
                toast.error('An unexpected error occurred!');
            }
        } finally {
            setIsloading(false);
        }
    }
    return (
        <>
            <div className="container py-4">
                {/* Search Input */}
                <div className="mb-4">
                    <div className="input-group">
                        <input
                            onChange={(e) => setSearchString(e.target.value)}
                            type="email"
                            value={searchString}
                            id="searchUser"
                            className="form-control rounded-pill border-primary"
                            placeholder="Search User"
                        />
                        <button
                            onClick={searchByString}
                            className="btn btn-primary rounded-pill px-4"
                        >
                            Search
                        </button>
                    </div>
                </div>


                {/* Cards Grid */}
                <div className="row g-4">
                    {users && <h1>Suggested Friend</h1>}
                    {users &&
                        users.map((user, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card w-100" style={{ height: "300px" }}>
                                    {/* Profile Image */}
                                    <div className="card-img-top d-flex justify-content-center p-3">
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${user.email}`}
                                            alt={user.name}
                                            className="rounded-circle border"
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* User Details */}
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-primary">{user.name}</h5>
                                        <p className="card-text text-muted">{user.email}</p>
                                        <button
                                            onClick={() => handleSendRequest(user._id)}
                                            className="btn btn-primary w-75"
                                        >
                                            Add Friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {/* Cards Grid */}
                <div className="row g-4">
                    {mutualUsers && <h1>Mutual Connections Friend</h1>}
                    {mutualUsers &&
                        mutualUsers.map((user, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card w-100" style={{ height: "300px" }}>
                                    {/* Profile Image */}
                                    <div className="card-img-top d-flex justify-content-center p-3">
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${user?.friend?.email}`}
                                            alt={user.name}
                                            className="rounded-circle border"
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* User Details */}
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-primary">{user?.friend?.name}</h5>
                                        <p className="card-text text-muted">{user?.friend?.email}</p>
                                        <button
                                            onClick={() => handleSendRequest(user.friend._id)}
                                            className="btn btn-primary w-75"
                                        >
                                            Add Friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {/* Cards Grid */}
                <div className="row g-4">
                    {friendsFriend && <h1>Friends Friend List</h1>}
                    {friendsFriend &&
                        friendsFriend.map((user, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card w-100" style={{ height: "300px" }}>
                                    {/* Profile Image */}
                                    <div className="card-img-top d-flex justify-content-center p-3">
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${user?.friend?.email}`}
                                            alt={user.name}
                                            className="rounded-circle border"
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* User Details */}
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-primary">{user?.friend?.name}</h5>
                                        <p className="card-text text-muted">{user?.friend?.email}</p>
                                        <button
                                            onClick={() => handleSendRequest(user.friend._id)}
                                            className="btn btn-primary w-75"
                                        >
                                            Add Friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <ToastContainer />
        </>
    )
}

export default UserProfile
