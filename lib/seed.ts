import db from './db';

const seedData = async () => {
  try {
    // Clear existing data
    await db.execute('DELETE FROM booking_requests');
    await db.execute('DELETE FROM status_history');
    await db.execute('DELETE FROM concerts');

    // Add concerts
    const concerts = [
      {
        name: 'Gai Home Concert',
        date: '2026-04-26',
        location: 'Vinhomes Ocean Park 3, Hưng Yên',
        image_url: '/images/hero.jpg'
      },
      {
        name: 'Show Của Đen',
        date: '2026-05-15',
        location: 'Sân vận động Mỹ Đình, Hà Nội',
        image_url: ''
      }
    ];

    for (const concert of concerts) {
      await db.execute('INSERT INTO concerts (name, date, location, image_url) VALUES (?, ?, ?, ?)', [
        concert.name, concert.date, concert.location, concert.image_url
      ]);
    }

    // Add sample bookings
    const bookings = [
      {
        customer_name: 'Nguyễn Văn A',
        phone: '0901234567',
        contact_method: 'Zalo',
        concert_name: 'Gai Home Concert',
        concert_date: '2026-04-26',
        concert_location: 'Vinhomes Ocean Park 3',
        pickup_area: 'Nhà hát lớn Hà Nội - 1 Tràng tiền',
        pickup_location: '',
        passengers: 2,
        car_type: 'xe 7 chỗ',
        service_type: 'Xe ghép',
        needs: '2 chiều',
        departure_time: '9:00 AM',
        return_time: 'kết thúc concert',
        total_amount: 600000,
        status: 'mới nhận',
        notes: 'Có mang theo lightstick và banner'
      },
      {
        customer_name: 'Trần Thị B',
        phone: '0987654321',
        contact_method: 'Gọi điện',
        concert_name: 'Gai Home Concert',
        concert_date: '2026-04-26',
        concert_location: 'Vinhomes Ocean Park 3',
        pickup_area: 'Time city - Cổng Vinmec',
        pickup_location: '',
        passengers: 1,
        car_type: 'Xe 16 chỗ',
        service_type: 'Xe ghép',
        needs: '1 chiều đi',
        departure_time: '13:00 PM',
        return_time: '-',
        total_amount: 120000,
        status: 'đã báo giá',
        notes: 'Đi cùng nhóm bạn 4 người'
      }
    ];

    for (const booking of bookings) {
      await db.execute(`
        INSERT INTO booking_requests (
          customer_name, phone, contact_method, concert_name, concert_date,
          concert_location, pickup_area, pickup_location, passengers,
          car_type, service_type, needs, departure_time, return_time,
          total_amount, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        booking.customer_name, booking.phone, booking.contact_method,
        booking.concert_name, booking.concert_date, booking.concert_location,
        booking.pickup_area, booking.pickup_location, booking.passengers,
        booking.car_type, booking.service_type, booking.needs, 
        booking.departure_time, booking.return_time,
        booking.total_amount, booking.status, booking.notes
      ]);
    }

    console.log('Detailed seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData();
