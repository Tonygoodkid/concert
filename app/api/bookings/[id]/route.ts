import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== "ATVNCG2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { status, internal_notes } = body;

    if (status) {
      await db.execute('UPDATE booking_requests SET status = ? WHERE id = ?', [status, id]);
      await db.execute('INSERT INTO status_history (booking_id, status) VALUES (?, ?)', [id, status]);
    }

    if (internal_notes !== undefined) {
      await db.execute('UPDATE booking_requests SET internal_notes = ? WHERE id = ?', [internal_notes, id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await db.queryOne('SELECT * FROM booking_requests WHERE id = ?', [id]);
    const history = await db.query('SELECT * FROM status_history WHERE booking_id = ? ORDER BY created_at DESC', [id]);
    
    return NextResponse.json({ ...booking, history });
  } catch (error) {
    console.error('Error fetching booking detail:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}
