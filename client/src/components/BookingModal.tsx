import React, { useState } from "react";
import axios from "axios";

type BookingModalProps = {
  courtId: number;
  courtName: string;
  courtPrice: number;
  currency: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const BookingModal: React.FC<BookingModalProps> = ({
  courtId,
  courtName,
  courtPrice,
  currency,
  userId,
  onClose,
  onSuccess,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [playersCount, setPlayersCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/api/reservations/create`, {
        court_id: courtId,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
        players_count: playersCount,
        price_cents: courtPrice * 100,
        currency: currency,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn transition-opacity">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="bg-gray-50 border-b border-gray-100 p-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Book <span className="text-blue-600">{courtName}</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">
              Number of Players
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={playersCount}
              onChange={(e) => setPlayersCount(Number(e.target.value))}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2">
            <p className="text-center text-blue-900 font-bold text-lg">
              Price: {courtPrice} {currency}
              <span className="text-sm font-normal text-blue-600 ml-1">
                / hour
              </span>
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Booking...
                </span>
              ) : (
                "Confirm Booking"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
