"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Music, ArrowLeft, Send, CheckCircle2, Info, Users, Car, MapPin, HelpCircle, Upload, Wallet, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

// Pricing configuration (1-way prices)
const PRICES = {
  "xe 7 chỗ": { shared: 150000, private: 1000000 },
  "Xe 16 chỗ": { shared: 120000, private: 1800000 },
  "Xe 29 chỗ": { shared: 100000, private: 3200000 },
};

export default function BookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    contact_method: "Zalo",
    concert_name: "Gai Home Concert",
    concert_date: "2026-04-26",
    concert_location: "Vinhomes Ocean Park 3, Hưng Yên",
    pickup_area: "Nhà hát lớn Hà Nội - 1 Tràng tiền",
    pickup_location: "", 
    passengers: 1,
    car_type: "xe 7 chỗ",
    service_type: "Xe ghép",
    needs: "2 chiều",
    departure_time: "-",
    return_time: "-",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  // Calculate Total Amount
  const totalAmount = useMemo(() => {
    const carTypePrices = PRICES[formData.car_type as keyof typeof PRICES];
    let basePrice = 0;
    
    if (formData.service_type === "Xe ghép") {
      basePrice = carTypePrices.shared * formData.passengers;
    } else {
      basePrice = carTypePrices.private;
    }

    // Apply multiplier based on needs (1 chiều = 1x, 2 chiều = 2x)
    const multiplier = formData.needs === "2 chiều" ? 2 : 1;
    return Math.round(basePrice * multiplier);
  }, [formData.car_type, formData.service_type, formData.passengers, formData.needs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total_amount: totalAmount,
          payment_receipt_path: receiptFile.name, // In a real app, this would be the uploaded URL
        }),
      });
      if (res.ok) {
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (error) {
      alert("Lỗi kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  const isDepartureDisabled = formData.needs === "1 chiều về";
  const isReturnDisabled = formData.needs === "1 chiều đi";

  if (success) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 border-2 border-primary animate-bounce-subtle">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Đặt chỗ thành công!</h1>
        <p className="text-gray-400 max-w-sm mb-12 leading-relaxed">
          Cảm ơn bạn đã tin tưởng Concert Go. Bọn mình đã nhận được thông tin và minh chứng chuyển khoản. Tài xế sẽ chủ động liên hệ với bạn qua <span className="text-white font-bold">{formData.contact_method}</span> trước ngày khởi hành.
        </p>
        <div className="flex flex-col w-full gap-4 max-w-xs">
          <Button onClick={() => setSuccess(false)} variant="outline">Đặt thêm cho bạn bè</Button>
          <Link href="/">
            <Button className="w-full">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 pb-24 font-sans">
      <div className="max-w-2xl mx-auto px-4 pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Quay lại
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-gradient">ĐẶT XE CONCERT</h1>
          <p className="text-gray-400 font-medium italic">Xe cộ để chúng mình lo, việc của gai con là quẩy hết mình!</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thông tin liên hệ */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Input 
                label="Họ và tên *" 
                name="customer_name" 
                value={formData.customer_name} 
                onChange={handleChange} 
                placeholder="Nhập họ tên của bạn" 
                required 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Số điện thoại *" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="09xx xxx xxx" 
                  required 
                />
                <Select 
                  label="Kênh liên hệ ưu tiên" 
                  name="contact_method" 
                  value={formData.contact_method} 
                  onChange={handleChange}
                >
                  <option value="Zalo">Zalo</option>
                  <option value="Gọi điện">Gọi điện</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin chuyến đi & phương tiện */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Thông tin chuyến đi & phương tiện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Tên concert" 
                  name="concert_name" 
                  value={formData.concert_name} 
                  readOnly
                  className="bg-background border-border/30 text-gray-500"
                />
                <Input 
                  label="Ngày diễn" 
                  name="concert_date" 
                  value={formData.concert_date} 
                  readOnly 
                  className="bg-background border-border/30 text-gray-500"
                />
              </div>

              <Select 
                label="Địa điểm đón" 
                name="pickup_area" 
                value={formData.pickup_area} 
                onChange={handleChange}
                required
              >
                <option value="Nhà hát lớn Hà Nội - 1 Tràng tiền">Nhà hát lớn Hà Nội - 1 Tràng tiền</option>
                <option value="Time city - Cổng Vinmec">Time city - Cổng Vinmec</option>
                <option value="Royal city - Cửa hầm R4">Royal city - Cửa hầm R4</option>
              </Select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select 
                  label="Loại xe" 
                  name="car_type" 
                  value={formData.car_type} 
                  onChange={handleChange}
                >
                  <option value="xe 7 chỗ">Xe 7 chỗ</option>
                  <option value="Xe 16 chỗ">Xe 16 chỗ</option>
                  <option value="Xe 29 chỗ">Xe 29 chỗ</option>
                </Select>
                <Select 
                  label="Hình thức" 
                  name="service_type" 
                  value={formData.service_type} 
                  onChange={handleChange}
                >
                  <option value="Xe ghép">Xe ghép</option>
                  <option value="Bao xe">Bao xe</option>
                </Select>
              </div>

              {formData.service_type === "Xe ghép" && (
                <Input 
                  label="Số lượng người" 
                  name="passengers" 
                  type="number"
                  min="1"
                  value={formData.passengers} 
                  onChange={handleChange} 
                  required 
                />
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Nhu cầu đi lại</label>
                <div className="grid grid-cols-3 gap-2">
                  {["1 chiều đi", "1 chiều về", "2 chiều"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, needs: item }))}
                      className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
                        formData.needs === item 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-background border-border/50 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select 
                    label="Giờ muốn đi" 
                    name="departure_time" 
                    value={formData.departure_time} 
                    onChange={handleChange}
                    disabled={isDepartureDisabled}
                    className={isDepartureDisabled ? "opacity-30 cursor-not-allowed" : ""}
                >
                    <option value="-">-</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="13:00 PM">13:00 PM</option>
                    <option value="15:30 PM">15:30 PM</option>
                </Select>
                
                <div className="space-y-1.5 relative">
                    <div className="flex items-center gap-1.5">
                        <label className="block text-sm font-semibold text-gray-300">Giờ về (Dự kiến)</label>
                        <div className="group relative">
                            <Info className="h-4 w-4 text-primary cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 border border-primary/20 text-[11px] text-gray-300 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 leading-relaxed backdrop-blur-xl">
                                Xe về sẽ theo lịch kết thúc thực tế tại sự kiện, sẽ đợi tối đa 30 phút sau thời điểm kết thúc concert.
                            </div>
                        </div>
                    </div>
                    <Select 
                        name="return_time" 
                        value={formData.return_time} 
                        onChange={handleChange}
                        disabled={isReturnDisabled}
                        className={isReturnDisabled ? "opacity-30 cursor-not-allowed" : ""}
                    >
                        <option value="-">-</option>
                        <option value="kết thúc concert">kết thúc concert</option>
                    </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chi phí & Thanh toán */}
          <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-primary/20 py-6">
              <CardTitle className="text-xl flex items-center gap-2 text-primary font-black uppercase italic">
                <Wallet className="h-6 w-6" /> Chi phí & Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Pricing Table */}
              <div className="p-6">
                <div className="rounded-2xl border border-border/50 overflow-hidden mb-8 bg-background/50">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-background/80 text-gray-400">
                      <tr>
                        <th className="px-4 py-4 font-bold border-b border-border/30">Loại xe</th>
                        <th className="px-4 py-4 font-bold border-b border-border/30 text-center">Ghép (1 chiều)</th>
                        <th className="px-4 py-4 font-bold border-b border-border/30 text-center">Bao xe (1 chiều)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {Object.entries(PRICES).map(([type, price]) => (
                        <tr key={type} className={`hover:bg-white/5 transition-colors ${formData.car_type === type ? "bg-primary/5" : ""}`}>
                          <td className="px-4 py-4 font-bold">{type}</td>
                          <td className="px-4 py-4 text-center text-gray-300">{formatCurrency(price.shared)}</td>
                          <td className="px-4 py-4 text-center text-gray-300">{formatCurrency(price.private)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-white/5 text-[10px] text-center text-gray-500 uppercase tracking-tighter italic">
                    * Giá trên là giá cho 1 chiều. Nếu đặt 2 chiều, chi phí sẽ được nhân đôi.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-background border border-primary/20 shadow-inner">
                      <p className="text-sm text-gray-400 font-bold mb-1 uppercase">Tổng chi phí cần thanh toán</p>
                      <h3 className="text-4xl font-black text-primary">{formatCurrency(totalAmount)}</h3>
                      <div className="mt-4 pt-4 border-t border-border/20 text-xs text-gray-500 space-y-1">
                        <p>• Hình thức: <span className="text-gray-300">{formData.service_type}</span></p>
                        <p>• Số lượng: <span className="text-gray-300">{formData.service_type === "Xe ghép" ? `${formData.passengers} người` : '1 xe'}</span></p>
                        <p>• Lộ trình: <span className="text-gray-300">{formData.needs}</span></p>
                      </div>
                    </div>

                    {/* QR Code Section (Moved up for better flow) */}
                    <div className="space-y-4 p-4 rounded-3xl bg-white/5 border border-white/10">
                      <p className="text-xs text-center text-gray-400 italic">Quét mã QR để thanh toán nhanh qua ứng dụng ngân hàng</p>
                      <div className="relative aspect-square max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 p-2 bg-white">
                        <Image 
                          src="/images/payment_qr.png" 
                          alt="Payment QR" 
                          fill 
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-black text-gray-300 uppercase tracking-wide">
                        <ReceiptText className="h-4 w-4 inline mr-2 text-primary" /> Minh chứng thanh toán *
                      </label>
                      <div className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${
                        receiptFile ? "border-green-500 bg-green-500/5" : "border-border/50 hover:border-primary/50 cursor-pointer"
                      }`}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required
                        />
                        {receiptFile ? (
                          <>
                            <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                            <p className="text-sm font-bold text-green-500">Đã chọn ảnh!</p>
                            <p className="text-xs text-green-500/70 truncate max-w-full px-4">{receiptFile.name}</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-gray-500 mb-2" />
                            <p className="text-sm font-bold text-gray-400">Tải ảnh biên lai (Bắt buộc)</p>
                            <p className="text-xs text-gray-500 mt-1">Hệ thống chỉ chấp nhận định dạng ảnh (.jpg, .png)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-8">
            <Button 
                type="submit" 
                size="full" 
                className={`h-20 text-2xl font-black tracking-widest shadow-2xl transition-all duration-300 ${
                    !receiptFile 
                    ? "opacity-30 grayscale cursor-not-allowed bg-zinc-800" 
                    : "bg-primary hover:scale-[1.02] shadow-primary/30"
                }`}
                disabled={loading || !receiptFile}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ĐANG XỬ LÝ...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  XÁC NHẬN ĐẶT XE <Send className="h-6 w-6" />
                </div>
              )}
            </Button>
            <p className="text-center text-xs text-gray-500 mt-6 px-12 leading-relaxed italic">
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Sau khi gửi, chúng mình sẽ đối soát và gửi thông tin tài xế sớm nhất.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
