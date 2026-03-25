import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Calendar, MapPin, Users, Car, Shield, Clock, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/hero.jpg" 
              alt="Concert Hero" 
              fill 
              className="object-cover opacity-60 brightness-75 scale-105 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest animate-fade-in">
              <Calendar className="h-3 w-3" /> Booking is Open for April 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight animate-fade-in text-gradient">
              ĐẶT XE ĐI CONCERT <br /> NHANH CHÓNG
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium animate-fade-in [animation-delay:200ms]">
              Dịch vụ đưa đón chuyên nghiệp, không lo tắc đường, không ngại tìm xe sau đêm diễn. Đặt trước dễ dàng, gai con an tâm về nhà!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in [animation-delay:400ms]">
              <Link href="/booking">
                <Button size="lg" className="px-12 shadow-lg shadow-primary/20">Đặt xe ngay</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="px-12">Tìm hiểu thêm</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Concert Highlight */}
        <section className="py-20 px-4 max-w-7xl mx-auto" id="concert-info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sự kiện nổi bật: <span className="text-primary italic">GAI HOME CONCERT</span></h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
                  <Calendar className="h-6 w-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-bold text-lg">Ngày diễn: 26.04.2026</h3>
                    <p className="text-gray-400">Lưu lịch để không bỏ lỡ đêm diễn bùng nổ!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
                  <MapPin className="h-6 w-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-bold text-lg">Vinhomes Ocean Park 3, Hưng Yên</h3>
                    <p className="text-gray-400">Chúng mình có xe từ mọi quận nội thành Hà Nội.</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 italic bg-white/5 p-4 rounded-xl border-l-4 border-primary">
                "Nên đặt sớm để giữ xe vào ngày đông khách. Đội ngũ tài xế thông thạo đường xá sẽ đưa bạn đến đúng giờ!"
              </p>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <Image 
                src="/images/venue.png" 
                alt="Venue Layout" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-card/50" id="benefits">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Tại sao nên chọn <span className="text-primary">Concert Go?</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Xe cộ để chúng mình lo, việc của gai con là khều tiếp day 10!!!!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "An toàn & Riêng tư", desc: "Tài xế chuyên nghiệp, xe sạch sẽ, không ghép khách lạ nếu bạn muốn xe riêng." },
                { icon: Clock, title: "Đúng giờ tuyệt đối", desc: "Không lo lỡ mất những giây phút đầu tiên của idol trên sân khấu." },
                { icon: Car, title: "Đa dạng loại xe", desc: "Từ xe máy, 4 chỗ đến xe 16 chỗ cho nhóm bạn quẩy hết mình." },
                { icon: Heart, title: "Hỗ trợ tận tâm", desc: "Trực hotline 24/7 suốt thời gian diễn ra concert." }
              ].map((benefit, i) => (
                <Card key={i} className="group hover:border-primary/50 transition-colors border-border/50 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-4 pt-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-4 max-w-7xl mx-auto text-center" id="how-it-works">
          <h2 className="text-4xl font-bold mb-16 tracking-tight">3 bước đặt xe cực chill</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-dashed border-t-2 border-dashed border-white/20 -translate-y-8"></div>
            {[
              { step: "01", title: "Điền thông tin", desc: "Hoàn thành form đặt xe đơn giản chỉ trong 1 phút." },
              { step: "02", title: "Thanh toán", desc: "Hoàn thành thanh toán và gửi lại ảnh thanh toán để hoàn thiện đơn" },
              { step: "03", title: "Đi concert", desc: "Bác tài đón bạn đúng giờ, chỉ việc ngồi lên xe và đi quẩy!" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 space-y-4 bg-background p-6">
                <div className="text-6xl font-black text-white/5 absolute -top-4 left-1/2 -translate-x-1/2">{step.step}</div>
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary mx-auto relative shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sticky CTA Placeholder for Desktop visibility */}
        <section className="py-20 bg-gradient-to-b from-card to-background text-center">
            <h2 className="text-3xl font-bold mb-8 italic">Gai con ơi về nhà thôi!</h2>
            <Link href="/booking">
                <Button size="lg" className="px-16 py-6 text-xl">Đặt xe ngay bây giờ</Button>
            </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
