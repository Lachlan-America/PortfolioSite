import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    // State to hold the form values
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize navigate function

    // Function to handle form submission
    const handleSubmit = async (e) => {
        // Stops the page from refreshing
        e.preventDefault();

        navigate('/login');
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} id="signupForm">
                <div>
                    <input className="border border-gray-300 rounded-lg shadow-lg mt-8 mb-2 w-lg p-10px"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input className="border border-gray-300 rounded-lg shadow-lg mb-2 w-lg p-10px"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input className="border border-gray-300 rounded-lg shadow-lg mb-5 w-lg p-10px"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="mb-3">Create Profile</button>
            </form>
        </div>
    );
}
