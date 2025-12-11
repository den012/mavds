import React, { useState, useEffect } from 'react';
import { auth } from './googleLogin/Config';
import { onAuthStateChanged, type User } from 'firebase/auth';
import axios from 'axios';

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
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, [user, API_URL]);

    const handleCancel = async (reservationId: number) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        try {
            await axios.patch(`${API_URL}/api/reservations/${reservationId}/cancel`, {
                cancel_reason: 'User cancelled'
            });
            setReservations(reservations.filter(r => r.id !== reservationId));
            alert('Reservation cancelled successfully');
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Failed to cancel reservation');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to view your reservations</div>;

    return (
        <div>
            <h2>My Reservations</h2>
            {reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : (
                <div>
                    {reservations.map((reservation) => (
                        <div key={reservation.id}>
                            <h3>{reservation.court_name}</h3>
                            <p>Start: {new Date(reservation.start_time).toLocaleString()}</p>
                            <p>End: {new Date(reservation.end_time).toLocaleString()}</p>
                            <p>Players: {reservation.players_count}</p>
                            <p>Price: {reservation.price_cents / 100} {reservation.currency}</p>
                            <p>Status: {reservation.status}</p>
                            {reservation.status === 'confirmed' && (
                                <button onClick={() => handleCancel(reservation.id)}>
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