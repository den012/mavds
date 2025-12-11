import React, { use } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BookingModal from './BookingModal';

import { auth } from "./googleLogin/Config";
import { onAuthStateChanged, type User } from 'firebase/auth';

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
            navigate('/');
            setUser(null);
        } catch(error) {
            console.error("Error signing out: ", error);
        }
    }

    useEffect( () => {
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
        alert('Booking successful!');
    };

    if(loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Home Page</h2>
            {user ? (
                <div>
                    <div>
                        <h2>Welcome, {user.displayName}</h2>
                        {user.photoURL && (
                            <img src={user.photoURL} alt="User Avatar" />
                        )}
                        <h2>Email: {user.email}</h2>
                        <button onClick={() => navigate('/reservations')}>My Reservations</button>
                        <button className="text-red-400" onClick={handleLogout}>Logout</button>
                    </div>

                    <div>
                        <h3>Courts</h3>
                        {courts.map((court) => (
                            <div key={court.id}>
                                <h4>{court.name}</h4>
                                <p>{court.description}</p>
                                <p>Indoor: {court.indoor ? 'Yes' : 'No'}</p>
                                <p>Capacity: {court.capacity}</p>
                                <p>Price: {court.price} {court.currency}</p>
                                <button onClick={() => handleBookClick(court)}>Book Now</button>
                            </div>
                        ))}
                    </div>

                    {showBookingModal && selectedCourt && user && (
                        <BookingModal
                            courtId={selectedCourt.id}
                            courtName={selectedCourt.name}
                            courtPrice={selectedCourt.price}
                            currency={selectedCourt.currency}
                            userId={user.uid}
                            onClose={() => setShowBookingModal(false)}
                            onSuccess={handleBookingSuccess}
                        />
                    )}
                </div>
            ) : (
                <p>Please log in</p>
            )}
        </div>
    );
}

export default Home;
                