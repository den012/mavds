import { db } from '../db/database';

// Mock the database
jest.mock('../db/database', () => ({
  db: {
    query: jest.fn(),
  },
}));

// Clean up after all tests
afterAll(async () => {
  jest.clearAllMocks();
});
