import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import BookingModal from "./BookingModal";

import { auth } from "./googleLogin/Config";
import { onAuthStateChanged, type User } from "firebase/auth";

type Court = {
  id: number;
  name: string;
  description: string | null;
  indoor: boolean;
  capacity: number;
  price: number;
  currency: string;
  timezone: string;
};

const Home: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User | null>(null);

  const [courts, setCourts] = useState<Court[]>([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    try {
      axios.get<Court[]>(`${API_URL}/api/getCourts`).then((response) => {
        setCourts(response.data);
      });
    } catch (error) {
      console.error("Error fetching courts: ", error);
    }
  }, []);

  const handleBookClick = (court: Court) => {
    console.log("Selected court: ", court);
    setSelectedCourt(court);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    alert("Booking successful!");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {user ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-12 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl">
                  {user.displayName ? user.displayName[0] : "U"}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome, {user.displayName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/reservations")}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                My Reservations
              </button>
              <button
                className="px-5 py-2.5 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-colors duration-200 border border-red-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-extrabold text-gray-900">
                Available Courts
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-8 w-full max-w-5xl mx-auto">
              {courts.map((court, index) => {
                let gridPositionClass = "";
                if (index === 0)
                  gridPositionClass = "md:col-start-1 md:row-start-1";
                if (index === 1)
                  gridPositionClass = "md:col-start-3 md:row-start-1";
                if (index === 2)
                  gridPositionClass = "md:col-start-2 md:row-start-2";
                if (index === 3)
                  gridPositionClass = "md:col-start-1 md:row-start-3";
                if (index === 4)
                  gridPositionClass = "md:col-start-3 md:row-start-3";

                return (
                  <div
                    key={court.id}
                    className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 ${gridPositionClass}`}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src="https://manzasport.com/wp-content/uploads/2024/03/Vista-cenital-pista-de-padel-modelo-Miami.jpeg"
                        alt="Padel Court"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {court.indoor && (
                        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          INDOOR
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold text-gray-900">
                          {court.name}
                        </h4>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-green-600">
                            {court.price} {court.currency}
                          </span>
                          <span className="text-xs text-gray-400">/ hour</span>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {court.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            ></path>
                          </svg>
                          <span>{court.capacity} Players</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                          </svg>
                          <span>{court.indoor ? "Indoor" : "Outdoor"}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookClick(court)}
                        className="mt-auto w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-md flex justify-center items-center gap-2"
                      >
                        Book Now
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {showBookingModal && selectedCourt && user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn">
                <BookingModal
                  courtId={selectedCourt.id}
                  courtName={selectedCourt.name}
                  courtPrice={selectedCourt.price}
                  currency={selectedCourt.currency}
                  userId={user.uid}
                  onClose={() => setShowBookingModal(false)}
                  onSuccess={handleBookingSuccess}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-xl text-gray-500 font-medium">
            Please log in to view courts.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
