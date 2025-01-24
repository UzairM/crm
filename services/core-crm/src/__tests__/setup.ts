import { beforeAll, afterAll, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.ORY_SDK_URL = 'https://auth.elphinstone.us';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Any global setup
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});