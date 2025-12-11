import { Request, Response } from 'express';
import mysql from "mysql2/promise";

import { db } from '../db/database';

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

export async function getPadelCourts(req: Request, res: Response) {
    try {
        const [courts] = await db.query("SELECT * FROM courts");
        res.status(200).json(courts);
    } catch (error) {
        console.error("Error fetching padel courts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createReservation(req: Request, res: Response) {
    try {
        const { court_id, user_id, start_time, end_time, players_count, price_cents, currency } = req.body;

        const [overlapping] = await db.query(
            `SELECT id FROM reservations 
             WHERE court_id = ? 
             AND status != 'cancelled'
             AND ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))`,
            [court_id, start_time, end_time, start_time, end_time]
        ) as [any[], any];

        if (overlapping.length > 0) {
            return res.status(400).json({ message: 'Court is already booked for this time slot' });
        }

        const [result] = await db.query(
            `INSERT INTO reservations (court_id, user_id, start_time, end_time, players_count, price_cents, currency)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [court_id, user_id, start_time, end_time, players_count, price_cents, currency]
        ) as [mysql.ResultSetHeader, any];

        res.status(201).json({ id: result.insertId, message: 'Reservation created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getUserReservations(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        const [reservations] = await db.query(
            `SELECT r.*, c.name as court_name 
             FROM reservations r
             JOIN courts c ON r.court_id = c.id
             WHERE r.user_id = ?
             ORDER BY r.start_time DESC`,
            [userId]
        );

        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function cancelReservation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { cancel_reason } = req.body;

        await db.query(
            `UPDATE reservations 
             SET status = 'cancelled', cancel_reason = ?, cancelled_at = NOW()
             WHERE id = ?`,
            [cancel_reason, id]
        );

        res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}