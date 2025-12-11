import React, { useState } from 'react';
import axios from 'axios';

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
    onSuccess
}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [playersCount, setPlayersCount] = useState(4);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(`${API_URL}/api/reservations/create`, {
                court_id: courtId,
                user_id: userId,
                start_time: startTime,
                end_time: endTime,
                players_count: playersCount,
                price_cents: courtPrice * 100,
                currency: currency
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create reservation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white">
            <div>
                <h2>Book {courtName}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Start Time:</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>End Time:</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Number of Players:</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={playersCount}
                            onChange={(e) => setPlayersCount(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <p>Price: {courtPrice} {currency}/hour</p>
                    </div>
                    {error && <p>{error}</p>}
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;