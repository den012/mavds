import request from 'supertest';
import express from 'express';
import { db } from '../db/database';
import { getPadelCourts } from '../controllers/padelCourts';

jest.mock('../db/database');

describe('Padel Courts', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/api/getCourts', getPadelCourts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all padel courts', async () => {
    const mockCourts = [
      {
        id: 1,
        name: 'Court A',
        description: 'Indoor court',
        indoor: true,
        capacity: 4,
        price: 5000,
        currency: 'EUR',
        timezone: 'Europe/Madrid'
      },
      {
        id: 2,
        name: 'Court B',
        description: 'Outdoor court',
        indoor: false,
        capacity: 4,
        price: 4000,
        currency: 'EUR',
        timezone: 'Europe/Madrid'
      }
    ];

    (db.query as jest.Mock).mockResolvedValue([mockCourts]);

    const response = await request(app).get('/api/getCourts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCourts);
    expect(response.body).toHaveLength(2);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM courts');
  });

  it('should return empty array when no courts exist', async () => {
    (db.query as jest.Mock).mockResolvedValue([[]]);

    const response = await request(app).get('/api/getCourts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 500 on database error', async () => {
    (db.query as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const response = await request(app).get('/api/getCourts');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
