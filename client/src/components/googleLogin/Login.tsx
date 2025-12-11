import React from 'react';
import axios from 'axios';

//firebase
import { auth, provider } from "./Config";
import { signInWithPopup } from "firebase/auth";

import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            navigate('/home');

            await axios.post(`${API_URL}/api/register`, {
                withCredentials: true,
                method: "POST",

                id: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
            });
        } catch (error) {
            console.error("Login failed:", error);
        }
    }
    return (
        <div>
            <h2>Login Page</h2>
            <button onClick={handleLogin}>Login with google</button>
        </div>
    );
}

export default Login;
                