import request from 'supertest';
import express from 'express';
import { db } from '../db/database';

jest.mock('../db/database');

describe('Health Endpoint', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/health', async (req, res) => {
      try {
        await db.query('SELECT 1');

        res.send({
          status: 'ok',
          databsae: 'connected',
          timestamp: new Date().toISOString()
        });
      } catch(error) {
        res.status(503).send({
          status: 'error',
          database: 'disconnected',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return 200 and ok status when database is connected', async () => {
    (db.query as jest.Mock).mockResolvedValueOnce([{ result: 1 }]);

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.databsae).toBe('connected');
    expect(response.body.timestamp).toBeDefined();
  });

  it('should return 503 when database is disconnected', async () => {
    (db.query as jest.Mock).mockRejectedValueOnce(new Error('Connection refused'));

    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body.status).toBe('error');
    expect(response.body.database).toBe('disconnected');
    expect(response.body.error).toBe('Connection refused');
  });
});
