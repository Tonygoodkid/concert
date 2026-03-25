import Database from 'better-sqlite3';
import path from 'path';
import { sql } from '@vercel/postgres';

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.POSTGRES_URL;

class LocalDB {
  private db: any;

  constructor() {
    const dbPath = path.resolve(process.cwd(), 'bookings.db');
    this.db = new Database(dbPath);
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS booking_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        contact_method TEXT NOT NULL,
        concert_name TEXT,
        concert_date TEXT,
        concert_location TEXT,
        pickup_area TEXT,
        pickup_location TEXT,
        passengers INTEGER,
        car_type TEXT,
        needs TEXT,
        departure_time TEXT,
        return_time TEXT,
        budget TEXT,
        notes TEXT,
        group_with_friends BOOLEAN DEFAULT 0,
        optimize_cost BOOLEAN DEFAULT 0,
        private_car BOOLEAN DEFAULT 0,
        children_luggage BOOLEAN DEFAULT 0,
        service_type TEXT,
        total_amount INTEGER,
        payment_receipt_path TEXT,
        status TEXT DEFAULT 'mới nhận',
        internal_notes TEXT,
        lead_source TEXT DEFAULT 'website',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER,
        status TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES booking_requests(id)
      );

      CREATE TABLE IF NOT EXISTS concerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT,
        location TEXT,
        image_url TEXT
      );

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  }

  async query(queryString: string, params: any[] = []) {
    return this.db.prepare(queryString).all(...params);
  }

  async queryOne(queryString: string, params: any[] = []) {
    return this.db.prepare(queryString).get(...params);
  }

  async execute(queryString: string, params: any[] = []) {
    const result = this.db.prepare(queryString).run(...params);
    return { lastInsertRowid: result.lastInsertRowid };
  }
}

class PostgresDB {
  private convertToPg(queryString: string) {
    let i = 1;
    return queryString.replace(/\?/g, () => `$${i++}`);
  }

  async query(queryString: string, params: any[] = []) {
    const pgQuery = this.convertToPg(queryString);
    const { rows } = await sql.query(pgQuery, params);
    return rows;
  }

  async queryOne(queryString: string, params: any[] = []) {
    const pgQuery = this.convertToPg(queryString);
    const { rows } = await sql.query(pgQuery, params);
    return rows[0];
  }

  async execute(queryString: string, params: any[] = []) {
    const pgQuery = this.convertToPg(queryString);
    // Use RETURNING id if it's an insert to mimic lastInsertRowid
    const finalQuery = pgQuery.toLowerCase().includes('insert') && !pgQuery.toLowerCase().includes('returning') 
      ? `${pgQuery} RETURNING id` 
      : pgQuery;
    
    const { rows } = await sql.query(finalQuery, params);
    return { lastInsertRowid: rows[0]?.id };
  }
}

const db = isProduction ? new PostgresDB() : new LocalDB();

export default db;
