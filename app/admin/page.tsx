"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Car, 
  User,
  Clock,
  ChevronRight,
  RefreshCcw,
  FileText,
  Settings,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Booking = {
  id: number;
  customer_name: string;
  phone: string;
  contact_method: string;
  concert_name: string;
  concert_date: string;
  concert_location: string;
  pickup_area: string;
  pickup_location: string;
  passengers: number;
  car_type: string;
  needs: string;
  departure_time: string;
  return_time: string;
  budget: string;
  notes: string;
  group_with_friends: number;
  optimize_cost: number;
  private_car: number;
  children_luggage: number;
  status: string;
  internal_notes: string;
  lead_source: string;
  booking_code: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  "mới nhận": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "đã liên hệ": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "đã báo giá": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "đã chốt": "bg-green-500/10 text-green-500 border-green-500/20",
  "đã hủy": "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authDetails, setAuthDetails] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-token": typeof window !== "undefined" ? localStorage.getItem("adminToken") || "" : ""
  });

  useEffect(() => {
    if (localStorage.getItem("adminToken") === "ATVNCG2024") {
       setIsAuthenticated(true);
       fetchBookings();
       fetchSettings();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authDetails.username === "admin" && authDetails.password === "ATVNCG2024") {
      localStorage.setItem("adminToken", "ATVNCG2024");
      setIsAuthenticated(true);
      setAuthError("");
      fetchBookings();
      fetchSettings();
    } else {
      setAuthError("Tài khoản hoặc mật khẩu không đúng.");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", { headers: getHeaders() });
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) alert("Lưu cài đặt thành công!");
    } catch (err) {
      alert("Lỗi khi lưu cài đặt.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", { headers: getHeaders() });
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: number, updates: Partial<Booking>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, ...updates });
        }
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
        <Card className="w-full max-w-sm bg-[#0a0a0a] border-[#1a1a1a] shadow-2xl">
          <CardHeader className="space-y-2 text-center border-b border-[#1a1a1a] pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/20">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight">ĐĂNG NHẬP ADMIN</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                label="Tài khoản" 
                value={authDetails.username} 
                onChange={(e) => setAuthDetails({...authDetails, username: e.target.value})} 
                required 
              />
              <Input 
                label="Mật khẩu" 
                type="password"
                value={authDetails.password} 
                onChange={(e) => setAuthDetails({...authDetails, password: e.target.value})} 
                required 
              />
              {authError && <p className="text-red-500 text-sm font-bold text-center mt-2">{authError}</p>}
              <Button type="submit" className="w-full mt-8" size="lg">Đăng nhập</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1a1a1a] bg-[#0a0a0a] hidden lg:flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-2 px-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter">ADMIN PANEL</span>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              activeTab === "bookings" ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <FileText className="h-5 w-5" /> Đơn đặt xe
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
              activeTab === "settings" ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className="h-5 w-5" /> Cài đặt
          </button>
        </nav>

        <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-1">Đang đăng nhập với quyền</p>
            <p className="text-sm font-bold">Quản trị viên</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0">
            <h1 className="text-xl font-bold">{activeTab === "bookings" ? "Danh sách yêu cầu đặt xe" : "Cài đặt hệ thống"}</h1>
            {activeTab === "bookings" && (
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={fetchBookings} disabled={loading}>
                        <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Làm mới
                    </Button>
                </div>
            )}
        </header>

        {activeTab === "bookings" ? (
          <>
        {/* Toolbar */}
        <div className="p-8 pb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc SĐT..."
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select 
                    className="h-10 text-sm py-0 w-40" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="mới nhận">Mới nhận</option>
                    <option value="đã liên hệ">Đã liên hệ</option>
                    <option value="đã báo giá">Đã báo giá</option>
                    <option value="đã chốt">Đã chốt</option>
                    <option value="đã hủy">Đã hủy</option>
                </Select>
            </div>
        </div>

        {/* Table/Content Area */}
        <div className="flex-1 overflow-auto px-8 py-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
                {/* List View */}
                <div className="xl:col-span-2 space-y-4 pb-20">
                    {loading ? (
                        <div className="h-40 flex items-center justify-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-2xl italic">Không tìm thấy yêu cầu nào</div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div 
                                key={booking.id}
                                onClick={() => setSelectedBooking(booking)}
                                className={cn(
                                    "p-4 rounded-2xl border transition-all cursor-pointer group",
                                    selectedBooking?.id === booking.id 
                                        ? "bg-primary/5 border-primary/50 ring-1 ring-primary/50" 
                                        : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333333]"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {booking.customer_name}
                                                <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 rounded hidden sm:inline-block">#{booking.booking_code}</span>
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold",
                                                    STATUS_COLORS[booking.status]
                                                )}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-3">
                                                <span>{booking.phone}</span>
                                                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                <span>{booking.contact_method}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString('vi-VN')}</div>
                                        <div className="text-xs text-gray-400 mt-1 uppercase font-bold text-primary">{booking.car_type}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5 text-[11px] uppercase font-bold text-gray-500">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {booking.concert_date}</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {booking.pickup_area}</div>
                                    <div className="flex items-center gap-1.5"><Car className="h-3 w-3" /> {booking.needs}</div>
                                    <div className="flex items-center gap-1.5 justify-end"><Clock className="h-3 w-3" /> {booking.departure_time}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Detail View */}
                <div className="hidden xl:block">
                    {selectedBooking ? (
                        <Card className="sticky top-0 border-primary/20 shadow-2xl shadow-primary/5">
                            <CardHeader className="bg-white/5">
                                <CardTitle className="text-xl flex items-center justify-between">
                                    Chi tiết yêu cầu #{selectedBooking.id}
                                    <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-white">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <section>
                                    <h4 className="text-xs font-bold text-primary uppercase mb-3 tracking-widest">Khách hàng</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Mã đặt chỗ:</span>
                                            <span className="font-bold text-primary font-mono">{selectedBooking.booking_code}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Họ tên:</span>
                                            <span className="font-bold">{selectedBooking.customer_name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">SĐT:</span>
                                            <span className="font-bold">{selectedBooking.phone}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Liên hệ qua:</span>
                                            <span className="font-bold text-blue-400">{selectedBooking.contact_method}</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-xs font-bold text-primary uppercase mb-3 tracking-widest">Hành trình</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Event:</span>
                                            <span className="font-bold">{selectedBooking.concert_name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Địa điểm đón:</span>
                                            <span className="font-bold text-right ml-4">{selectedBooking.pickup_location} ({selectedBooking.pickup_area})</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Thời gian đi:</span>
                                            <span className="font-bold">{selectedBooking.departure_time} - {selectedBooking.concert_date}</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-xs font-bold text-primary uppercase mb-3 tracking-widest">Ghi chú & Tùy chọn</h4>
                                    <div className="p-3 rounded-lg bg-black text-xs text-gray-400 leading-relaxed border border-white/5">
                                        {selectedBooking.notes || "Không có ghi chú thêm."}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {selectedBooking.group_with_friends === 1 && <span className="px-2 py-1 rounded bg-white/10 text-[10px] text-gray-300">NHÓM BẠN</span>}
                                        {selectedBooking.optimize_cost === 1 && <span className="px-2 py-1 rounded bg-white/10 text-[10px] text-gray-300">GHÉP XE</span>}
                                        {selectedBooking.private_car === 1 && <span className="px-2 py-1 rounded bg-white/10 text-[10px] text-gray-300">XE RIÊNG</span>}
                                    </div>
                                </section>

                                <section className="pt-4 border-t border-white/10 space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Cập nhật trạng thái</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.keys(STATUS_COLORS).map((status) => (
                                                <button
                                                    key={status}
                                                    disabled={isUpdating}
                                                    onClick={() => updateBooking(selectedBooking.id, { status })}
                                                    className={cn(
                                                        "px-2 py-2 rounded-lg text-[10px] font-bold border transition-all",
                                                        selectedBooking.status === status
                                                            ? STATUS_COLORS[status]
                                                            : "bg-transparent border-white/5 text-gray-500 hover:border-white/20"
                                                    )}
                                                >
                                                    {status.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Ghi chú nội bộ</h4>
                                        <textarea 
                                            className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                            rows={3}
                                            placeholder="Ghi chú về khách này..."
                                            defaultValue={selectedBooking.internal_notes}
                                            onBlur={(e) => updateBooking(selectedBooking.id, { internal_notes: e.target.value })}
                                        />
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-3xl text-gray-600 text-center">
                            <FileText className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-sm">Chọn một yêu cầu để xem chi tiết</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto p-8">
             <form onSubmit={handleSaveSettings} className="max-w-4xl mx-auto space-y-8">
                <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardHeader className="border-b border-[#1a1a1a]">
                    <CardTitle className="text-lg text-primary">Biểu phí xe ghép (1 chiều)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                      label="Xe 7 chỗ (VNĐ)" 
                      type="number" 
                      value={settings.price_7_shared || ""} 
                      onChange={(e) => setSettings({...settings, price_7_shared: e.target.value})} 
                    />
                    <Input 
                      label="Xe 16 chỗ (VNĐ)" 
                      type="number" 
                      value={settings.price_16_shared || ""} 
                      onChange={(e) => setSettings({...settings, price_16_shared: e.target.value})} 
                    />
                    <Input 
                      label="Xe 29 chỗ (VNĐ)" 
                      type="number" 
                      value={settings.price_29_shared || ""} 
                      onChange={(e) => setSettings({...settings, price_29_shared: e.target.value})} 
                    />
                  </CardContent>
                </Card>

                <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardHeader className="border-b border-[#1a1a1a]">
                    <CardTitle className="text-lg text-primary">Biểu phí bao xe (1 chiều)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                      label="Xe 7 chỗ (VNĐ)" 
                      type="number" 
                      value={settings.price_7_private || ""} 
                      onChange={(e) => setSettings({...settings, price_7_private: e.target.value})} 
                    />
                    <Input 
                      label="Xe 16 chỗ (VNĐ)" 
                      type="number" 
                      value={settings.price_16_private || ""} 
                      onChange={(e) => setSettings({...settings, price_16_private: e.target.value})} 
                    />
                    <Input 
                      label="Xe 29 chỗ (VNĐ)" 
                      type="number" 
                      value={settings.price_29_private || ""} 
                      onChange={(e) => setSettings({...settings, price_29_private: e.target.value})} 
                    />
                  </CardContent>
                </Card>

                <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardHeader className="border-b border-[#1a1a1a]">
                    <CardTitle className="text-lg text-primary">Thông tin thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Input 
                      label="Link ảnh QR Code" 
                      type="text" 
                      placeholder="VD: /images/payment_qr.png hoặc URL trực tiếp"
                      value={settings.qr_code_url || ""} 
                      onChange={(e) => setSettings({...settings, qr_code_url: e.target.value})} 
                    />
                    {settings.qr_code_url && (
                       <div className="mt-4 p-4 border border-[#1a1a1a] rounded-xl flex justify-center bg-white/5">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={settings.qr_code_url} alt="QR Preview" className="max-h-[200px] rounded-lg" />
                       </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" disabled={isSavingSettings} className="w-full sm:w-auto px-12">
                     {isSavingSettings ? "Đang lưu..." : "Lưu cài đặt"}
                  </Button>
                </div>
             </form>
          </div>
        )}
      </main>
    </div>
  );
}
