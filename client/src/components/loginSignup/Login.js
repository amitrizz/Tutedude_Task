import React, { useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./LoginSignup.css"


function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    

    const navigate = useNavigate();
    const handleLogin = async (event) => {
        // Perform login logic
        event.preventDefault();

        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/login`, {
            email, password
        })
        console.log(res);
        localStorage.setItem('token', res.data.token);
        navigate("/");
        // window.location.reload();
        // setIsLoggedIn(true);
        // console.log(name, email, password,password);

        // Invoke the callback function after successful login
        // onLoginSuccess();
    };
    return (
        <div className='body'>
            <form onSubmit={handleLogin} className='form'>
                <h1>Login</h1>
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
                <Link to={"/register"} className={"link-styles"}>Click Register</Link>
            </form>
        </div>
    )
}

export default Login
