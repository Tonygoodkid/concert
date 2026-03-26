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
        booking_code TEXT,
        license_plate TEXT,
        driver_phone TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Attempt to alter table if it already exists (Postgres)
    try {
      await sql`ALTER TABLE booking_requests ADD COLUMN booking_code TEXT`;
    } catch (e) {}
    try {
      await sql`ALTER TABLE booking_requests ADD COLUMN license_plate TEXT`;
    } catch (e) {}
    try {
      await sql`ALTER TABLE booking_requests ADD COLUMN driver_phone TEXT`;
    } catch (e) {}

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

    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `;

    // Seed default settings if empty
    const defaultSettings = [
      { key: 'qr_code_url', value: '/images/payment_qr.png' },
      { key: 'bank_id', value: 'VCB' },
      { key: 'bank_account_no', value: '1111111111' },
      { key: 'bank_account_name', value: 'NGUYEN VAN A' },
      { key: 'price_7_shared', value: '150000' },
      { key: 'price_7_private', value: '1000000' },
      { key: 'price_16_shared', value: '120000' },
      { key: 'price_16_private', value: '1800000' },
      { key: 'price_29_shared', value: '100000' },
      { key: 'price_29_private', value: '3200000' }
    ];

    for (const setting of defaultSettings) {
      await sql`
        INSERT INTO app_settings (key, value)
        VALUES (${setting.key}, ${setting.value})
        ON CONFLICT (key) DO NOTHING
      `;
    }

    return NextResponse.json({ success: true, message: 'Database initialized successfully!' });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
