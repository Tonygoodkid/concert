# Concert Go - Dịch vụ đặt xe Concert

Ứng dụng web đặt xe đưa đón concert chuyên nghiệp (Mobile-first).

## Công nghệ sử dụng
- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js Route Handlers.
- **Database**: SQLite (`better-sqlite3`).

## Cấu trúc thư mục
- `/app`: Chứa các trang (Landing, Booking, Admin) và API.
- `/components`: Chứa các UI components và Layout.
- `/lib`: Chứa khởi tạo Database và tiện ích.
- `/public/images`: Chứa ảnh concert và branding.

## Cài đặt và Chạy local

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Seed dữ liệu mẫu**:
   ```bash
   npx tsx lib/seed.ts
   ```

3. **Chạy môi trường development**:
   ```bash
   npm run dev
   ```

4. **Truy cập**:
   - Trang chủ & Đặt xe: `http://localhost:3000`
   - Quản trị viên (Admin): `http://localhost:3000/admin`

## Các tính năng chính
- Landing page tối ưu chuyển đổi, hình ảnh sắc nét.
- Form đặt xe chuẩn mobile, hỗ trợ nhiều tùy chọn (Zalo, SĐT, loại xe).
- Dashboard quản trị: Quản lý lead, đổi trạng thái (pipeline), ghi chú nội bộ.
- Database SQLite duy nhất, dễ dàng deploy và backup.

## Ghi chú cho Operator
- Đây là mô hình Lead Generation: Bạn nhận yêu cầu -> Liên hệ khách -> Chốt giá -> Bố trí xe thủ công.
- Không có hệ thống Driver hay Marketplace tự động để giữ cho quy trình tinh gọn và hiệu quả.
