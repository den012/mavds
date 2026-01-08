import request from 'supertest';
import express from 'express';
import { db } from '../db/database';
import { createReservation, getUserReservations, cancelReservation } from '../controllers/padelCourts';

jest.mock('../db/database');

describe('Reservations', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/api/reservations/create', createReservation);
    app.get('/api/reservations/user/:userId', getUserReservations);
    app.patch('/api/reservations/:id/cancel', cancelReservation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Reservation', () => {
    it('should create a reservation successfully', async () => {
      const mockResult = { insertId: 1 };
      (db.query as jest.Mock)
        .mockResolvedValueOnce([[]]) // No overlapping reservations
        .mockResolvedValueOnce([mockResult]); // Insert successful

      const reservationData = {
        court_id: 1,
        user_id: 'user123',
        start_time: '2026-01-10 10:00:00',
        end_time: '2026-01-10 11:00:00',
        players_count: 4,
        price_cents: 5000,
        currency: 'EUR'
      };

      const response = await request(app)
        .post('/api/reservations/create')
        .send(reservationData);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
      expect(response.body.message).toBe('Reservation created successfully');
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 when time slot is already booked', async () => {
      const overlapping = [{ id: 5 }];
      (db.query as jest.Mock).mockResolvedValueOnce([overlapping]);

      const reservationData = {
        court_id: 1,
        user_id: 'user123',
        start_time: '2026-01-10 10:00:00',
        end_time: '2026-01-10 11:00:00',
        players_count: 4,
        price_cents: 5000,
        currency: 'EUR'
      };

      const response = await request(app)
        .post('/api/reservations/create')
        .send(reservationData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Court is already booked for this time slot');
    });

    it('should return 500 on database error', async () => {
      (db.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      const reservationData = {
        court_id: 1,
        user_id: 'user123',
        start_time: '2026-01-10 10:00:00',
        end_time: '2026-01-10 11:00:00',
        players_count: 4,
        price_cents: 5000,
        currency: 'EUR'
      };

      const response = await request(app)
        .post('/api/reservations/create')
        .send(reservationData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });

  describe('Get User Reservations', () => {
    it('should return all reservations for a user', async () => {
      const mockReservations = [
        {
          id: 1,
          court_id: 1,
          user_id: 'user123',
          start_time: '2026-01-10 10:00:00',
          end_time: '2026-01-10 11:00:00',
          court_name: 'Court A',
          status: 'confirmed'
        },
        {
          id: 2,
          court_id: 2,
          user_id: 'user123',
          start_time: '2026-01-11 14:00:00',
          end_time: '2026-01-11 15:00:00',
          court_name: 'Court B',
          status: 'confirmed'
        }
      ];

      (db.query as jest.Mock).mockResolvedValue([mockReservations]);

      const response = await request(app).get('/api/reservations/user/user123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReservations);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when user has no reservations', async () => {
      (db.query as jest.Mock).mockResolvedValue([[]]);

      const response = await request(app).get('/api/reservations/user/user456');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 on database error', async () => {
      (db.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/reservations/user/user123');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });

  describe('Cancel Reservation', () => {
    it('should cancel a reservation successfully', async () => {
      (db.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app)
        .patch('/api/reservations/123/cancel')
        .send({ cancel_reason: 'Weather conditions' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reservation cancelled successfully');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE reservations'),
        ['Weather conditions', '123']
      );
    });

    it('should return 500 on database error', async () => {
      (db.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch('/api/reservations/123/cancel')
        .send({ cancel_reason: 'Changed plans' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });
});
