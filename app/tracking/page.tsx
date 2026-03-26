"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Car, User, MapPin, Calendar, Clock, Phone, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type TrackedBooking = {
  id: number;
  customer_name: string;
  phone: string;
  booking_code: string;
  concert_name: string;
  pickup_location: string;
  pickup_area: string;
  departure_time: string;
  concert_date: string;
  status: string;
  license_plate: string;
  driver_phone: string;
  return_license_plate: string;
  return_driver_phone: string;
  total_amount: number;
  car_type: string;
  needs: string;
  return_time: string;
};

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  "mới nhận": { label: "Chờ xác nhận", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  "đang xác thực": { label: "Chờ xác nhận", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  "đã xác thực": { label: "Đã xác nhận", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  "đã có thông tin xe": { label: "Đã có tài xế", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  "đã chốt": { label: "Đã chốt xe (Cũ)", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  "đã hủy": { label: "Đã hủy", color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function TrackingPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<TrackedBooking[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 4) {
      setError("Vui lòng nhập ít nhất 4 ký tự.");
      return;
    }
    
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(`/api/bookings/track?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }
      
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-28 pb-20 fade-in-up">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại trang chủ
        </Link>
        
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter">Tra cứu chuyến đi</h1>
          <p className="text-gray-400 text-lg">
            Khều thông tin tài xế và biển số xe của bạn bằng Mã đơn hàng hoặc Số điện thoại.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                type="text"
                placeholder="Nhập phần số điện thoại hoặc Mã đơn (#CG...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-black/50 border-white/10"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="h-14 px-8 text-base">
              {loading ? "Đang tìm..." : "Tra cứu"}
            </Button>
          </form>
          {error && <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4"/> {error}</p>}
        </div>

        {results !== null && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Kết quả trả về <span className="text-sm font-normal text-gray-500">({results.length} Chuyến)</span>
            </h2>
            
            {results.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                 <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                 <p className="text-gray-400">Không tìm thấy đơn hàng nào. Hãy kiểm tra lại Số điện thoại hoặc Mã đơn.</p>
              </div>
            ) : (
              results.map((booking) => {
                const statusInfo = STATUS_MAP[booking.status.toLowerCase()] || { label: booking.status, color: "text-gray-400 bg-gray-400/10 border-gray-400/20" };
                const isConfirmed = booking.status.toLowerCase() === "đã chốt" || booking.status.toLowerCase() === "đã có thông tin xe";

                return (
                  <Card key={booking.id} className="bg-card border-white/10 overflow-hidden relative">
                    {/* Status Badge */}
                    <div className={cn("absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold border", statusInfo.color)}>
                      {statusInfo.label.toUpperCase()}
                    </div>
                    
                    <CardContent className="p-6 md:p-8 space-y-8">
                      {/* Code & Name */}
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Mã chuyến đi</p>
                        <h3 className="text-2xl font-black font-mono tracking-widest text-primary">{booking.booking_code}</h3>
                        <p className="text-lg font-bold mt-2">{booking.customer_name} <span className="text-gray-500 font-normal ml-2">{booking.phone}</span></p>
                      </div>

                      {/* Journey Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-5 rounded-2xl border border-white/5">
                         {booking.needs !== '1 chiều về' && (
                         <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><MapPin className="h-4 w-4"/> Đón khách</p>
                            <p className="font-medium">{booking.pickup_location}</p>
                            <p className="text-sm text-gray-400">{booking.pickup_area}</p>
                            <p className="mt-3 text-sm flex items-center gap-2 text-blue-300"><Clock className="h-4 w-4"/> {booking.departure_time} - {booking.concert_date}</p>
                         </div>
                         )}
                         <div className={cn("pt-4 md:pt-0 border-white/10", booking.needs !== '1 chiều về' ? "border-t md:border-t-0 md:border-l md:pl-6" : "")}>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><MapPin className="h-4 w-4"/> Sự kiện</p>
                            <p className="font-medium">{booking.concert_name}</p>
                            <p className="mt-3 text-sm flex items-center gap-2 text-purple-300"><Car className="h-4 w-4"/> {booking.car_type.toUpperCase()}</p>
                            {booking.needs !== '1 chiều đi' && (
                              <p className="mt-2 text-sm flex items-center gap-2 text-orange-300"><Clock className="h-4 w-4"/> {booking.return_time} {booking.return_time !== 'kết thúc concert' ? `- ${booking.concert_date}` : ''}</p>
                            )}
                         </div>
                      </div>

                      {/* Driver Details (Only show if confirmed) */}
                      <div className="border border-primary/30 bg-primary/5 rounded-2xl p-6">
                         <h4 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2">
                           <User className="h-4 w-4"/> Thông tin Tài xế
                         </h4>
                         {isConfirmed ? (
                           <div className="space-y-6">
                               {booking.needs !== '1 chiều về' && (
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">Biển số xe {booking.needs === '2 chiều' ? '(Chiều Đi)' : ''}</p>
                                    <p className="text-xl font-mono font-black">{booking.license_plate || "Đang cập nhật"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-1">SĐT liên hệ</p>
                                    <p className="text-xl font-black">{booking.driver_phone || "Đang cập nhật"}</p>
                                  </div>
                               </div>
                               )}
                               
                               {booking.needs !== '1 chiều đi' && (
                               <div className={cn("pt-4 mt-4", booking.needs === '2 chiều' ? "border-t border-white/10" : "")}>
                                   {booking.needs === '2 chiều' && <p className="text-xs text-orange-400 font-bold mb-3 uppercase flex items-center gap-2"><Car className="h-4 w-4"/> Chuyến Về</p>}
                                   <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs text-gray-400 mb-1">Biển số xe {booking.needs !== '1 chiều về' ? '(Về)' : ''}</p>
                                        <p className="text-xl font-mono font-black">{booking.return_license_plate || "Đang cập nhật"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400 mb-1">SĐT liên hệ</p>
                                        <p className="text-xl font-black">{booking.return_driver_phone || "Đang cập nhật"}</p>
                                      </div>
                                   </div>
                               </div>
                               )}
                           </div>
                         ) : (
                           <div className="text-center py-4 text-gray-400 text-sm space-y-2">
                             <Car className="h-8 w-8 mx-auto opacity-50" />
                             <p>Hệ thống đang xác nhận hoặc sắp xếp xe cho bạn.</p>
                             <p>Thông tin biển số và tài xế sẽ hiển thị khi chuyến đi được xác nhận <span className="text-green-400 font-bold">(ĐÃ CÓ TÀI XẾ)</span>.</p>
                           </div>
                         )}
                      </div>
                      
                      {isConfirmed && (booking.driver_phone || booking.return_driver_phone) && (
                        <div className="flex gap-3 flex-col sm:flex-row">
                          {booking.driver_phone && (
                            <a href={`tel:${booking.driver_phone}`} className="flex-1">
                              <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                                <Phone className="h-4 w-4 mr-2" /> Gọi Tài xế (ĐI)
                              </Button>
                            </a>
                          )}
                          {booking.return_driver_phone && (
                            <a href={`tel:${booking.return_driver_phone}`} className="flex-1">
                              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20">
                                <Phone className="h-4 w-4 mr-2" /> Gọi Tài xế (VỀ)
                              </Button>
                            </a>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
