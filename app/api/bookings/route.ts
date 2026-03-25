import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== "ATVNCG2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db.query('SELECT * FROM booking_requests ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name, phone, contact_method, concert_name, concert_date,
      concert_location, pickup_area, pickup_location, passengers,
      car_type, needs, departure_time, return_time, budget, notes,
      group_with_friends, optimize_cost, private_car, children_luggage,
      service_type, total_amount, payment_receipt_path
    } = body;

    const result = await db.execute(`
      INSERT INTO booking_requests (
        customer_name, phone, contact_method, concert_name, concert_date,
        concert_location, pickup_area, pickup_location, passengers,
        car_type, needs, departure_time, return_time, budget, notes,
        group_with_friends, optimize_cost, private_car, children_luggage,
        service_type, total_amount, payment_receipt_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      customer_name, phone, contact_method, concert_name, concert_date,
      concert_location, pickup_area, pickup_location, passengers,
      car_type, needs, departure_time, return_time, budget, notes,
      group_with_friends ? 1 : 0, optimize_cost ? 1 : 0, 
      private_car ? 1 : 0, children_luggage ? 1 : 0,
      service_type, total_amount, payment_receipt_path
    ]);

    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('Error submitting booking:', error);
    return NextResponse.json({ error: 'Failed to submit booking' }, { status: 500 });
  }
}
