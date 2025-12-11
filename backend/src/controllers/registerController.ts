import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2/promise';
import { db } from '../db/database';

export const registerUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {uid, name, email, photo} = req.body;

        const [result] = await db.query<ResultSetHeader>(
            'INSERT IGNORE INTO users (uid, name, email, photo) VALUES (?, ?, ?, ?)',
            [uid, name, email, photo]
        );


        if (result.affectedRows > 0) {
            console.log('New user saved successfully:', name);
            res.status(201).json({ message: 'User created successfully' });
        } else {
            console.log('User already exists:', name);
            res.status(200).json({ message: 'User already exists' });
        }

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}