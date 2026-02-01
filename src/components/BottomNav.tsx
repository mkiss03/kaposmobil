'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, ScanLine, BarChart } from 'lucide-react';

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/card',
    label: 'Card',
    icon: CreditCard,
  },
  {
    href: '/inspector',
    label: 'Inspector',
    icon: ScanLine,
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: BarChart,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 md:max-w-96 md:left-1/2 md:transform md:-translate-x-1/2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive
                ? 'text-blue-600 font-bold hover:bg-blue-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Icon
              size={24}
              className={isActive ? 'text-blue-600 font-bold' : 'text-gray-500'}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={`text-xs ${isActive ? 'font-bold text-blue-600' : 'font-medium text-gray-500'}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
