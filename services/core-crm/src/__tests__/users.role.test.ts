// Mock modules before imports
jest.mock('@prisma/client', () => {
  const mockUpdate = jest.fn();
  const mockFindUnique = jest.fn();
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        update: mockUpdate,
        findUnique: mockFindUnique
      },
      $disconnect: jest.fn()
    })),
    Role: {
      MANAGER: 'MANAGER',
      AGENT: 'AGENT',
      CLIENT: 'CLIENT'
    }
  };
});

jest.mock('@ory/client', () => ({
  Configuration: jest.fn(),
  FrontendApi: jest.fn().mockImplementation(() => ({
    toSession: jest.fn().mockImplementation(() => ({
      data: {
        identity: {
          id: 'test-id',
          traits: { email: 'test@example.com' }
        }
      }
    }))
  }))
}));

import { describe, expect, it, beforeAll, jest, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import userRoutes from '../routes/users';

describe('User Role Management', () => {
  let app: Express;
  let server: any;
  const prisma = require('@prisma/client');
  const mockUpdate = prisma.PrismaClient().user.update;
  const mockFindUnique = prisma.PrismaClient().user.findUnique;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
    server = app.listen(0);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdate.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'AGENT',
      isActive: true
    });
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'MANAGER',
      isActive: true
    });
  });

  const mockUsers = {
    manager: {
      id: 1,
      oryIdentityId: 'ory_1',
      email: 'manager@test.com',
      role: 'MANAGER',
    },
    agent: {
      id: 2,
      oryIdentityId: 'ory_2',
      email: 'agent@test.com',
      role: 'AGENT',
    },
    client: {
      id: 3,
      oryIdentityId: 'ory_3',
      email: 'client@test.com',
      role: 'CLIENT',
    },
  };

  describe('POST /api/users/:id/role', () => {
    it('should allow manager to change user roles', async () => {
      const response = await request(app)
        .post('/api/users/2/role')
        .set('Cookie', 'test-session')
        .set('x-mock-user', JSON.stringify(mockUsers.manager))
        .send({ role: 'AGENT' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('role', 'AGENT');
    });

    it('should not allow agent to change user roles', async () => {
      const response = await request(app)
        .post('/api/users/3/role')
        .set('Cookie', 'test-session')
        .set('x-mock-user', JSON.stringify(mockUsers.agent))
        .send({ role: 'MANAGER' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Insufficient permissions');
    });

    it('should not allow client to change user roles', async () => {
      const response = await request(app)
        .post('/api/users/2/role')
        .set('Cookie', 'test-session')
        .set('x-mock-user', JSON.stringify(mockUsers.client))
        .send({ role: 'AGENT' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Insufficient permissions');
    });

    it('should reject invalid role values', async () => {
      const response = await request(app)
        .post('/api/users/2/role')
        .set('Cookie', 'test-session')
        .set('x-mock-user', JSON.stringify(mockUsers.manager))
        .send({ role: 'INVALID_ROLE' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid role');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/users/2/role')
        .send({ role: 'AGENT' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'No session cookie found');
    });
  });
});
