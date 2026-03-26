import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 4) {
      return NextResponse.json({ error: 'Vui lòng nhập Mã đơn hàng hoặc Số điện thoại (tối thiểu 4 ký tự)' }, { status: 400 });
    }

    const rawQuery = query.trim();
    const searchTermCode = rawQuery.toUpperCase().startsWith('#') ? rawQuery.toUpperCase() : '#' + rawQuery.toUpperCase();
    const searchTermPhone = `%${rawQuery}%`;
    
    // Search by exact booking_code or exact phone
    let rows: any[] = [];
    try {
      rows = await db.query(
        `SELECT 
          id, customer_name, phone, booking_code, concert_name, 
          pickup_location, pickup_area, departure_time, return_time, concert_date,
          status, license_plate, driver_phone, return_license_plate, return_driver_phone, total_amount, car_type, needs
         FROM booking_requests 
         WHERE UPPER(booking_code) = ? OR phone LIKE ?
         ORDER BY id DESC LIMIT 5`,
         [searchTermCode, searchTermPhone]
      );
    } catch (err) {
      console.error("Query tracking error:", err);
    }
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to track booking:', error);
    return NextResponse.json({ error: 'Failed to search booking' }, { status: 500 });
  }
}
