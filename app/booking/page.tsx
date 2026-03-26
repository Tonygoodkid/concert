"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Music, ArrowLeft, Send, CheckCircle2, Info, Users, Car, MapPin, HelpCircle, Upload, Wallet, ReceiptText, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Remove non-alphanumeric chars (except spaces)
  str = str.replace(/[^a-zA-Z0-9 ]/g, "");
  return str.toUpperCase();
}
const DEFAULT_PRICES = {
  "xe 7 chỗ": { shared: 150000, private: 1000000 },
  "Xe 16 chỗ": { shared: 120000, private: 1800000 },
  "Xe 29 chỗ": { shared: 100000, private: 3200000 },
};

export default function BookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  const [qrCodeUrl, setQrCodeUrl] = useState("/images/payment_qr.png");
  const [bankSettings, setBankSettings] = useState<{ id: string, no: string, name: string } | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    // Generate Booking Code
    const code = "CG" + Math.random().toString(36).substring(2, 7).toUpperCase();
    setBookingCode(code);
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.bank_id && data.bank_account_no) {
              setBankSettings({
                id: data.bank_id.trim(),
                no: data.bank_account_no.trim(),
                name: data.bank_account_name ? data.bank_account_name.trim() : "",
              });
            }
            if (data.qr_code_url) setQrCodeUrl(data.qr_code_url);
            setPrices({
              "xe 7 chỗ": { 
                 shared: Number(data.price_7_shared) || DEFAULT_PRICES["xe 7 chỗ"].shared, 
                 private: Number(data.price_7_private) || DEFAULT_PRICES["xe 7 chỗ"].private 
              },
              "Xe 16 chỗ": { 
                 shared: Number(data.price_16_shared) || DEFAULT_PRICES["Xe 16 chỗ"].shared, 
                 private: Number(data.price_16_private) || DEFAULT_PRICES["Xe 16 chỗ"].private 
              },
              "Xe 29 chỗ": { 
                 shared: Number(data.price_29_shared) || DEFAULT_PRICES["Xe 29 chỗ"].shared, 
                 private: Number(data.price_29_private) || DEFAULT_PRICES["Xe 29 chỗ"].private 
              },
            });
          }
        }
      } catch(err) {
        console.error(err);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);
  
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

  const totalAmount = useMemo(() => {
    const carTypePrices = prices[formData.car_type as keyof typeof prices];
    let basePrice = 0;
    
    if (formData.service_type === "Xe ghép") {
      basePrice = carTypePrices.shared * formData.passengers;
    } else {
      basePrice = carTypePrices.private;
    }

    // Apply multiplier based on needs (1 chiều = 1x, 2 chiều = 2x)
    const multiplier = formData.needs === "2 chiều" ? 2 : 1;
    return Math.round(basePrice * multiplier);
  }, [formData.car_type, formData.service_type, formData.passengers, formData.needs, prices]);

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
          booking_code: bookingCode
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

  const cleanName = formData.customer_name ? removeVietnameseTones(formData.customer_name) : "TEN CUA BAN";
  const transferContent = `${cleanName} ${bookingCode}`;
  
  const dynamicQrUrl = bankSettings 
    ? `https://img.vietqr.io/image/${bankSettings.id}-${bankSettings.no}-compact.png?amount=${totalAmount}&addInfo=${encodeURIComponent(transferContent)}`
    : qrCodeUrl;

  if (success) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border-2 border-green-500 animate-bounce-subtle">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Đặt chỗ thành công!</h1>
        <p className="text-gray-400 max-w-sm mb-12 leading-relaxed">
          Cảm ơn các đồng gai đã tin tưởng bọn mình. Chúng tớ đã nhận được thông tin đơn hàng và ảnh thanh toán. Thông tin sẽ được xác nhận và được cập nhật trạng thái đơn hàng tại trang chủ mục Tra cứu đơn. Bạn sẽ được thêm vào group xe Zalo trước ngày khởi hành.
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
          <p className="text-gray-400 font-medium italic">Xe cộ để chúng mình lo, việc của gai con là khều tiếp day 10!!!!</p>
          {bookingCode && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full shadow-lg">
              <span className="text-xs text-gray-400 uppercase font-bold mr-2">Mã đơn hàng:</span>
              <span className="text-sm font-black tracking-widest text-white">{bookingCode}</span>
            </div>
          )}
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
                      {Object.entries(prices).map(([type, price]) => (
                        <tr key={type} className={`hover:bg-white/5 transition-colors ${formData.car_type === type ? "bg-primary/5" : ""}`}>
                          <td className="px-4 py-4 font-bold">{type}</td>
                          <td className="px-4 py-4 text-center text-gray-300">
                            {isLoadingSettings ? <div className="h-4 bg-white/10 rounded animate-pulse w-20 mx-auto"></div> : formatCurrency(price.shared)}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-300">
                            {isLoadingSettings ? <div className="h-4 bg-white/10 rounded animate-pulse w-20 mx-auto"></div> : formatCurrency(price.private)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-white/5 text-[10px] text-center text-gray-500 uppercase tracking-tighter italic">
                    * Giá trên là giá cho 1 chiều. Nếu đặt 2 chiều, chi phí sẽ được nhân đôi.
                  </div>
                </div>

                <div className="space-y-8 mt-8">
                  <div className="p-6 rounded-3xl bg-background border border-primary/30 shadow-inner w-full flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-gray-400 font-bold mb-1 uppercase text-center md:text-left">Tổng chi phí cần thanh toán</p>
                      <h3 className="text-4xl font-black text-primary text-center md:text-left">{formatCurrency(totalAmount)}</h3>
                    </div>
                    <div className="flex gap-6 text-xs text-gray-400 font-medium border-t border-border/20 md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0 w-full md:w-auto justify-center md:justify-start">
                      <div className="space-y-1">
                        <p>Hình thức:</p>
                        <p>Số lượng:</p>
                        <p>Lộ trình:</p>
                      </div>
                      <div className="space-y-1 font-bold text-white text-right">
                        <p>{formData.service_type}</p>
                        <p>{formData.service_type === "Xe ghép" ? `${formData.passengers} người` : '1 xe'}</p>
                        <p>{formData.needs}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                      <p className="text-sm text-center text-gray-300 font-bold uppercase tracking-wider">Quét mã QR để thanh toán nhanh</p>
                      <div className="aspect-[4/5] bg-white rounded-3xl relative overflow-hidden ring-4 ring-white/10 shadow-2xl">
                        {isLoadingSettings ? (
                           <div className="absolute inset-0 bg-white/5 animate-pulse rounded-3xl"></div>
                        ) : (
                           <img 
                             src={dynamicQrUrl} 
                             alt="Payment QR" 
                             className="w-full h-full object-contain absolute inset-0"
                           />
                        )}
                      </div>
                      
                      <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/30">
                        <p className="text-xs text-primary font-bold uppercase mb-3 text-center">Nội dung chuyển khoản</p>
                        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border-2 border-primary shadow-inner">
                          <span className="font-mono text-sm sm:text-base md:text-lg font-black tracking-wider text-black break-words flex-1 text-center">
                            {transferContent}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => {
                              navigator.clipboard.writeText(transferContent);
                              alert("Đã sao chép nội dung chuyển khoản!");
                            }} 
                            className="ml-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-primary shrink-0" 
                            title="Sao chép"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center italic leading-relaxed">
                          (Vui lòng <span className="text-white font-bold">sao chép chính xác</span> nội dung này để hệ thống đối soát tự động)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                      <div className="space-y-4 h-full flex flex-col">
                        <label className="block text-sm font-black text-gray-300 uppercase tracking-wide text-center md:text-left">
                          <ReceiptText className="h-4 w-4 inline mr-2 text-primary" /> Hình ảnh chuyển khoản *
                        </label>
                        <div className={`relative flex-1 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                          receiptFile ? "border-green-500 bg-green-500/5" : "border-border/50 hover:border-primary/50 cursor-pointer bg-background/50"
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
                              <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
                              <p className="text-base font-bold text-green-500">Đã chọn ảnh!</p>
                              <p className="text-sm text-green-500/80 truncate max-w-full px-4 mt-2">...{receiptFile.name.slice(-15)}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-500 mb-3" />
                              <p className="text-sm font-bold text-gray-400">Chạm để tải ảnh lên (Bắt buộc)</p>
                              <p className="text-xs text-gray-600 mt-2">Hỗ trợ định dạng .jpg, .png</p>
                            </>
                          )}
                        </div>
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
