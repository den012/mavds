import React, { useState, useEffect } from "react";
import { auth } from "./googleLogin/Config";
import { onAuthStateChanged, type User } from "firebase/auth";
import axios from "axios";

type Reservation = {
  id: number;
  court_id: number;
  court_name: string;
  start_time: string;
  end_time: string;
  status: string;
  players_count: number;
  price_cents: number;
  currency: string;
  created_at: string;
};

const Reservations: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      try {
        const response = await axios.get<Reservation[]>(
          `${API_URL}/api/reservations/user/${user.uid}`
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [user, API_URL]);

  const handleCancel = async (reservationId: number) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      await axios.patch(`${API_URL}/api/reservations/${reservationId}/cancel`, {
        cancel_reason: "User cancelled",
      });
      setReservations(reservations.filter((r) => r.id !== reservationId));
      alert("Reservation cancelled successfully");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("Failed to cancel reservation");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your reservations</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight pl-1 border-l-4 border-blue-600">
        My Reservations
      </h2>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-xl text-gray-500 font-medium">
            No reservations found
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Book a court to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-6 flex flex-col relative overflow-hidden group"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                {reservation.court_name}
              </h3>

              <div className="space-y-2.5 flex-grow">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-gray-400 text-xs uppercase w-12">
                    Start:
                  </span>
                  <span className="font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    {new Date(reservation.start_time).toLocaleString()}
                  </span>
                </p>

                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-gray-400 text-xs uppercase w-12">
                    End:
                  </span>
                  <span className="font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                    {new Date(reservation.end_time).toLocaleString()}
                  </span>
                </p>

                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-semibold text-gray-400 text-xs uppercase w-12">
                    Players:
                  </span>
                  <span className="font-bold">{reservation.players_count}</span>
                </p>

                <p className="text-lg text-gray-900 mt-2 flex items-center gap-2">
                  <span className="font-semibold text-gray-400 text-xs uppercase w-12">
                    Price:
                  </span>
                  <span className="font-extrabold text-green-600">
                    {reservation.price_cents / 100} {reservation.currency}
                  </span>
                </p>

                <p className="text-sm mt-1 flex items-center gap-2">
                  <span className="font-semibold text-gray-400 text-xs uppercase w-12">
                    Status:
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      reservation.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : reservation.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </p>
              </div>

              {reservation.status === "confirmed" && (
                <button
                  onClick={() => handleCancel(reservation.id)}
                  className="mt-6 w-full py-3 px-4 bg-white border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 text-sm uppercase tracking-wide shadow-sm"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
