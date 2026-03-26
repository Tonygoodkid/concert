import Link from 'next/link';
import { Music } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter text-white">CONCERT GO</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="#benefits" className="text-gray-300 hover:text-white transition-colors">Lợi ích</Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">Cách đặt</Link>
            <Link href="/tracking" className="text-gray-300 hover:text-white transition-colors">Tra cứu đơn</Link>
          </nav>
          <Link href="/booking">
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all">
              Đặt ngay
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
