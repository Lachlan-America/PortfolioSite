import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main"; // Import the API URL

export default function SignupPage() {
    // State to hold the form values
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize navigate function

    const debounce = (func, delay) => {
        let timeoutId;
        // args is the array of arguments passed to func
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };
    
    // This will check if the username is available after a 500ms delay
    const checkUsernameAvailability = useCallback(
        debounce(async (usernameToCheck) => {
            if (usernameToCheck.length > 0) {
                const res = await fetch(`${API_URL}/api/check-username`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameToCheck }),
                });

                const data = await res.json();
                setIsUsernameAvailable(res.status === 200);
                setError(res.status === 200 ? "" : data.message);
            }
        }, 500),
        [] // ← empty dependency array means this is only created once
    );
    
    // Run whenever the username changes (runs on render)
    useEffect(() => {
        checkUsernameAvailability(username);
    }, [username, checkUsernameAvailability]);
    
    // Once the form is submitted, this function will be called
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isUsernameAvailable && password === repeatPassword) {
            // Submit the form data if the username is available
            const res = await fetch(`${API_URL}/api/create-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            // The response object
            const data = await res.json();

            if (res.status === 201) {
                alert('Profile created successfully!');
                navigate('/login');
            } else {
                alert('Profile creation failed.');
            }
        } else {
            alert('Please choose a different username.');
        }
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
                <p className="">{error}</p>
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
