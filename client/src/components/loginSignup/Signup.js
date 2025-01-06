import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Signup() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const handleSignUp = async (event) => {
        event.preventDefault();
        // Perform login logic
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/register`, {
            name, email, password, password_confirmation: password
        })
        console.log(res);
        navigate("/login")
        // window.location.reload();
        // localStorage.setItem('token', res.data.token);

        // setIsLoggedIn(true);
        // console.log(name, email, password,password);

        // Invoke the callback function after successful login
        // onLoginSuccess();
    };
    return (
        <div className='body'>
            <form onSubmit={handleSignUp} className='form'>
                <h1>Signup</h1>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Enter Name</label>
                    <input onChange={e => setName(e.target.value)} type="text" className="form-control" id="exampleInputName" />
                    <div id="nameHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <button type="submit" className="btn btn-outline-secondary">Submit</button>
                <Link to={"/login"} className={"link-styles"}>Login Here</Link>
            </form>
        </div >
    )
}

export default Signup
