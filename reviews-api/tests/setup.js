import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Simple setup - Jest will handle the rest
console.log('Test environment loaded');