import request from 'supertest';
import express from 'express';
import { db } from '../db/database';
import { registerUser } from '../controllers/registerController';

jest.mock('../db/database');

describe('User Registration', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/api/register', registerUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const mockResult = { affectedRows: 1, insertId: 1 };
    (db.query as jest.Mock).mockResolvedValue([mockResult]);

    const userData = {
      uid: 'google123',
      name: 'John Doe',
      email: 'john@example.com',
      photo: 'https://example.com/photo.jpg'
    };

    const response = await request(app)
      .post('/api/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(db.query).toHaveBeenCalledWith(
      'INSERT IGNORE INTO users (uid, name, email, photo) VALUES (?, ?, ?, ?)',
      [userData.uid, userData.name, userData.email, userData.photo]
    );
  });

  it('should return 200 when user already exists', async () => {
    const mockResult = { affectedRows: 0 };
    (db.query as jest.Mock).mockResolvedValue([mockResult]);

    const userData = {
      uid: 'google123',
      name: 'John Doe',
      email: 'john@example.com',
      photo: 'https://example.com/photo.jpg'
    };

    const response = await request(app)
      .post('/api/register')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User already exists');
  });

  it('should return 500 on database error', async () => {
    (db.query as jest.Mock).mockRejectedValue(new Error('Database error'));

    const userData = {
      uid: 'google123',
      name: 'John Doe',
      email: 'john@example.com',
      photo: 'https://example.com/photo.jpg'
    };

    const response = await request(app)
      .post('/api/register')
      .send(userData);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
