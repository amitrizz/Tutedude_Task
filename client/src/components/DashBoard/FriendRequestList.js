import axios from "axios"
import React, { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../DashBoardCSS/AddEmployee.css"
import { useNavigate } from 'react-router-dom';



function FriendRequestList() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [isloading, setIsloading] = React.useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const fetchUserDetails = async () => {
    try {
      setIsloading(true);
      if (!token) {
        navigate("/login");
      }
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/friend/friend-request-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        }
      );
      if (!res) {
        navigate("/login");
      }
      console.log(res);
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

  const handleFriendRequest = async (receiverId, state) => {
    try {
      setIsloading(true);

      const res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/friend//send-request-update/${receiverId}`,
        { state: state },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        }
      );
      if (!res) {
        navigate("/login");
      }
      toast.success(`Friend ${state} Successfully`)
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

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto mt-10 p-4">
          {isloading ? (
            <p className="text-center text-xl font-semibold">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


              {users && users.map((user, index) => (





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
                      <h5 className="card-title text-primary">{user?.sender?.name}</h5>
                      <p className="card-text text-muted">{user?.sender?.email}</p>
                      <button onClick={() => handleFriendRequest(user.sender._id, 'accept')} className="btn btn-outline-primary">Accept Friend</button>
                      <button onClick={() => handleFriendRequest(user.sender._id, 'reject')} className="btn btn-outline-danger">Remove Friend</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default FriendRequestList
