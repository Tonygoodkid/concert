import { NextResponse } from 'next/server';
import db from '@/lib/db';

const defaultSettings = [
  { key: 'qr_code_url', value: '/images/payment_qr.png' },
  { key: 'price_7_shared', value: '150000' },
  { key: 'price_7_private', value: '1000000' },
  { key: 'price_16_shared', value: '120000' },
  { key: 'price_16_private', value: '1800000' },
  { key: 'price_29_shared', value: '100000' },
  { key: 'price_29_private', value: '3200000' }
];

export async function GET() {
  try {
    // If local SQLite, ensure defaults are inserted
    if (!process.env.POSTGRES_URL) {
      for (const setting of defaultSettings) {
        await db.execute(
          `INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)`, 
          [setting.key, setting.value]
        );
      }
    }

    let rows: any[] = [];
    try {
      rows = await db.query('SELECT key, value FROM app_settings');
    } catch(err) {
      // In case Postgres table isn't created yet, fall back to default
      console.warn("Table might not exist yet", err);
    }

    const effectiveRows = rows.length === 0 ? defaultSettings : rows;

    const settingsObj: Record<string, string> = {};
    effectiveRows.forEach((row: any) => {
      settingsObj[row.key] = row.value;
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== "ATVNCG2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    for (const [key, value] of Object.entries(body)) {
      await db.execute(`
        INSERT INTO app_settings (key, value) 
        VALUES (?, ?) 
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `, [key, String(value)]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
