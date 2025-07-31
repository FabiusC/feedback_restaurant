import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "feedback_restaurant",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "server",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool(dbConfig);

    // Handle pool errors
    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async initializeTables(): Promise<void> {
    try {
      // Create employee table
      await this.query(`
        CREATE TABLE IF NOT EXISTS employee (
          idemployee SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          isactive BOOLEAN DEFAULT true,
          createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create review table
      await this.query(`
        CREATE TABLE IF NOT EXISTS review (
          idreview SERIAL PRIMARY KEY,
          idemployee INTEGER REFERENCES employee(idemployee),
          ratespeedservice INTEGER CHECK (ratespeedservice >= 1 AND ratespeedservice <= 5) NOT NULL,
          ratesatisfactionfood INTEGER CHECK (ratesatisfactionfood >= 1 AND ratesatisfactionfood <= 5) NOT NULL,
          rateemployee INTEGER CHECK (rateemployee >= 1 AND rateemployee <= 5),
          comment TEXT,
          ispublic BOOLEAN DEFAULT false,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("✅ Database tables initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing database tables:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export default DatabaseConnection;
