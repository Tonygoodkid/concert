# Hướng dẫn Deploy lên Vercel (kèm Database)

Vì ứng dụng bạn đã chọn cách deploy lên **Vercel**, chúng ta cần thực hiện một số bước để thiết lập Database thực tế (PostgreSQL) thay vì dùng file SQLite cục bộ.

## Bước 1: Đưa code lên GitHub
1. Tạo một repository mới trên GitHub (github.com).
2. Tại Terminal thư mục dự án trên máy bạn, chạy các lệnh:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment with Postgres"
   git branch -M main
   # Thay LINK_GITHUB_CUA_BAN bằng URL repo bạn vừa tạo (ví dụ: https://github.com/username/concert-booking.git)
   git remote add origin <LINK_GITHUB_CUA_BAN>
   git push -u origin main
   ```

## Bước 2: Import vào Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub của bạn.
2. Chọn **Add New** -> **Project**.
3. Bấm **Import** bên cạnh repository bạn vừa push lên.
4. Đừng bấm Deploy vội, hãy cuộn xuống phần **Environment Variables**. Ở bước này, bạn chưa có Database nên để trống và cứ bấm **Deploy**. Quá trình sẽ thành công (nhưng tính năng gửi Data sẽ chưa hoạt động).

## Bước 3: Cấu hình Vercel Postgres
1. Nhấn vào nút **Continue to Dashboard** sau khi Deploy xong.
2. Từ Dashboard dự án trên Vercel, chuyển sang tab **Storage**.
3. Chọn **Create Database** -> **Postgres**.
4. Chọn Khu vực (Region): Nên chọn **Singapore (sin1)** để tốc độ về Việt Nam nhanh nhất, sau đó bấm **Create**.
5. Làm theo hướng dẫn trên màn hình. Mọi thiết lập biến môi trường như `POSTGRES_URL` sẽ được Vercel **tự động** liên kết vào dự án của bạn!

## Bước 4: Khởi tạo bảng dữ liệu (Migration) & Redeploy
Hiện tại, Vercel đã gắn thành công biến môi trường vào dự án, nhưng bản code đang chạy chưa biết điều đó. Mọt chuyện đã được mình set tự động trong code.
1. Chuyển sang tab **Deployments** trên trang Dashboard của Vercel.
2. Chạm vào biểu tượng dấu 3 chấm (Menu) ở bản build trên cùng.
3. Chọn **Redeploy** (không chọn Use existing Build Cache).
4. Hệ thống sẽ build lại ứng dụng. Khi xong, bạn mở tên miền mà Vercel cung cấp, dữ liệu cấu trúc bảng Database sẽ ngay lập tức được tự động tạo.

## Bước 5: (Tùy chọn) Thêm dữ liệu mẫu vào Postgres
Nếu muốn Dashboard có sẵn một số dữ liệu demo:
- Bạn truy cập vào tab **Storage** -> Click vào tên Database vừa tạo > Sang tab **Query**.
- Bạn mở file `lib/db.ts` trong code của mình, copy đoạn cài đặt bảng `booking_requests`, `status_history` và chạy thử. Nhưng thường bước Khởi tạo ở trên là đủ rồi.

---
**Lưu ý quan trọng**:
- Ảnh QR thanh toán (`public/images/payment_qr.png`) đã hoạt động tốt.
- Mọi đơn hàng mới sẽ được lưu vào Vercel Postgres một cách an toàn, bạn có thể xem trực tiếp qua trang `/admin` ngay trên tên miền của Vercel.
