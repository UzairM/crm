import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testConnection() {
  try {
    // Try to create a test record
    const testRecord = await prisma.testConnection.create({
      data: {
        message: 'Database connection successful!'
      }
    });
    
    console.log('Database connection test successful:', testRecord);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export default prisma; 