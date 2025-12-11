import React from "react";
import axios from "axios";

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

      navigate("/home");

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
  };
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans bg-white">
      <div className="relative w-full md:w-1/2 lg:w-2/3 h-64 md:h-screen bg-gray-900">
        <img
          src="https://padelworldpress.es/wp-content/uploads/2025/06/Tapia-y-Coello-Buenos-Aires.jpg"
          alt="Padel Court"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-end md:justify-center p-8 md:p-16">
          <h2 className="text-white text-3xl md:text-5xl font-extrabold mb-2 md:mb-6 leading-tight">
            Find courts and <br className="hidden md:block" /> players near you.
          </h2>
          <p className="text-gray-200 text-sm md:text-lg max-w-md">
            Join the community, book your match, and play anywhere, anytime.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center p-6 md:p-12 bg-white -mt-6 md:mt-0 rounded-t-[30px] md:rounded-none z-10 relative">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center md:text-left">
            <span className="inline-block p-2 bg-blue-600 rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </span>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Login to manage your bookings.</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 group"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">
                Secure Authentication
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-gray-600 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
