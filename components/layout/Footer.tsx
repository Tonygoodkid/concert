import { Music, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tighter text-white">CONCERT GO</span>
            </div>
            <p className="text-gray-400 text-sm">
              Dịch vụ xe đưa đón concert chuyên nghiệp, an toàn và đúng giờ tại Việt Nam.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 underline decoration-primary decoration-2 underline-offset-4">Liên hệ</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> 090 123 4567</p>
              <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Zalo: Concert Go Team</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 underline decoration-primary decoration-2 underline-offset-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#faq" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50 pt-8 text-center text-xs text-gray-500">
          © 2026 Concert Go. All Rights Reserved. Designed for concert lovers.
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-white/10 z-50 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Link href="/tracking" className="flex-1">
          <button className="w-full h-12 bg-white/5 active:bg-white/10 text-white rounded-xl text-sm font-bold border border-white/10 flex items-center justify-center gap-2 transition-colors">
            Tra cứu
          </button>
        </Link>
        <Link href="/booking" className="flex-[2]">
          <button className="w-full h-12 bg-primary active:bg-primary/80 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 uppercase tracking-wide transition-colors">
            Đặt xe ngay
          </button>
        </Link>
      </div>
    </footer>
  );
}
