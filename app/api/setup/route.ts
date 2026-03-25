import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS booking_requests (
        id SERIAL PRIMARY KEY,
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
        group_with_friends BOOLEAN DEFAULT FALSE,
        optimize_cost BOOLEAN DEFAULT FALSE,
        private_car BOOLEAN DEFAULT FALSE,
        children_luggage BOOLEAN DEFAULT FALSE,
        service_type TEXT,
        total_amount INTEGER,
        payment_receipt_path TEXT,
        status TEXT DEFAULT 'mới nhận',
        internal_notes TEXT,
        lead_source TEXT DEFAULT 'website',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS status_history (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES booking_requests(id),
        status TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS concerts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        date TEXT,
        location TEXT,
        image_url TEXT
      )
    `;

    return NextResponse.json({ success: true, message: 'Database initialized successfully!' });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
