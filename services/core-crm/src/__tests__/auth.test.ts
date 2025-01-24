// Mock modules before imports
jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn();
  const mockFindUnique = jest.fn();
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: mockCreate,
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

// Mock ORY SDK
jest.mock('@ory/client', () => {
  const mockToSession = jest.fn();
  
  return {
    Configuration: jest.fn(),
    FrontendApi: jest.fn().mockImplementation(() => ({
      toSession: mockToSession
    }))
  };
});

import { describe, expect, it, beforeAll, jest, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import { requireAuth } from '../middleware/auth';

describe('Auth Middleware & Login Flow', () => {
  let app: Express;
  let server: any;
  const prisma = require('@prisma/client');
  const mockCreate = prisma.PrismaClient().user.create;
  const mockFindUnique = prisma.PrismaClient().user.findUnique;
  const ory = require('@ory/client');
  const mockToSession = ory.FrontendApi().toSession;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Test route protected by auth
    app.get('/test-auth', requireAuth, (req, res) => {
      res.json({ user: req.user });
    });
    
    server = app.listen(0);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Flow & User Creation', () => {
    it('should create new user if not exists after ORY authentication', async () => {
      // Mock successful ORY session
      mockToSession.mockResolvedValueOnce({
        data: {
          id: 'test-session-id',
          identity: {
            id: 'test-ory-id',
            traits: { 
              email: 'test@example.com',
              name: {
                first: 'Test',
                last: 'User'
              }
            }
          }
        }
      });

      // Mock that user doesn't exist in DB
      mockFindUnique.mockResolvedValueOnce(null);
      
      // Mock successful user creation
      mockCreate.mockResolvedValueOnce({
        id: 1,
        oryIdentityId: 'test-ory-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
        isActive: true
      });

      const response = await request(app)
        .get('/test-auth')
        .set('Cookie', ['test-session=123']);

      expect(response.status).toBe(200);
      expect(mockToSession).toHaveBeenCalledWith({
        cookie: 'test-session=123'
      });
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { oryIdentityId: 'test-ory-id' }
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          oryIdentityId: 'test-ory-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'CLIENT'
        }
      });
      expect(response.body.user).toMatchObject({
        email: 'test@example.com',
        role: 'CLIENT'
      });
    });

    it('should use existing user if found after ORY authentication', async () => {
      // Mock successful ORY session
      mockToSession.mockResolvedValueOnce({
        data: {
          id: 'test-session-id',
          identity: {
            id: 'test-ory-id',
            traits: { 
              email: 'test@example.com',
              name: {
                first: 'Test',
                last: 'User'
              }
            }
          }
        }
      });

      // Mock existing user in DB
      mockFindUnique.mockResolvedValueOnce({
        id: 1,
        oryIdentityId: 'test-ory-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
        isActive: true
      });

      const response = await request(app)
        .get('/test-auth')
        .set('Cookie', ['test-session=123']);

      expect(response.status).toBe(200);
      expect(mockToSession).toHaveBeenCalledWith({
        cookie: 'test-session=123'
      });
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { oryIdentityId: 'test-ory-id' }
      });
      expect(mockCreate).not.toHaveBeenCalled();
      expect(response.body.user).toMatchObject({
        email: 'test@example.com',
        role: 'CLIENT'
      });
    });

    it('should reject requests without session cookie', async () => {
      const response = await request(app)
        .get('/test-auth');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'No session cookie found');
    });

    it('should handle invalid ORY sessions', async () => {
      // Mock ORY session validation failure
      mockToSession.mockRejectedValueOnce(new Error('Invalid session'));

      const response = await request(app)
        .get('/test-auth')
        .set('Cookie', ['test-session=123']);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
    });
  });
}); 
