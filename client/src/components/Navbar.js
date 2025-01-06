import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './DashBoardCSS/Navbar.css'

function Navbar() {
    const navigate = useNavigate();
    function logoutUser() {
        localStorage.removeItem('token')
        navigate("/login")
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container-fluid">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand">
                        <img
                            src="/logo1.png"
                            alt="logo"
                            className="rounded-circle"
                            style={{ width: "100px", height: "40px" }}
                        />
                    </Link>

                    {/* Navbar Toggle for Mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar Links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/friend-list" className="nav-link active">Friend List</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/friend-request-list" className="nav-link active">Friend Requests</Link>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-danger"
                                    onClick={logoutUser}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>

    )
}

export default Navbar
