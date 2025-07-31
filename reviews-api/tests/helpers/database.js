import pool from '../../src/config/database.js';

export const clearDatabase = async () => {
  try {
    await pool.query('DELETE FROM reviews');
    await pool.query('DELETE FROM employees');
    await pool.query('ALTER SEQUENCE employees_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE reviews_id_seq RESTART WITH 1');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

export const seedTestData = async () => {
  try {
    // Insert test employees
    const employee1 = await pool.query(
      'INSERT INTO employees (name, email, isactive) VALUES ($1, $2, $3) RETURNING *',
      ['John Doe', 'john@test.com', true]
    );
    
    const employee2 = await pool.query(
      'INSERT INTO employees (name, email, isactive) VALUES ($1, $2, $3) RETURNING *',
      ['Jane Smith', 'jane@test.com', true]
    );

    // Insert test reviews
    await pool.query(
      'INSERT INTO reviews (idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic) VALUES ($1, $2, $3, $4, $5, $6)',
      [employee1.rows[0].id, 4, 5, 4, 'Great service and delicious food!', true]
    );

    await pool.query(
      'INSERT INTO reviews (idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic) VALUES ($1, $2, $3, $4, $5, $6)',
      [employee2.rows[0].id, 3, 4, 5, 'Very friendly staff and good food quality.', true]
    );

    await pool.query(
      'INSERT INTO reviews (idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic) VALUES ($1, $2, $3, $4, $5, $6)',
      [employee1.rows[0].id, 5, 3, 4, 'Fast service but food could be better.', false]
    );

    return {
      employee1: employee1.rows[0],
      employee2: employee2.rows[0]
    };
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  await pool.end();
}; 