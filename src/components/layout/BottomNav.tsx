'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/learn', label: 'Learn', icon: '📖' },
  { href: '/quiz', label: 'Quiz', icon: '🎯' },
  { href: '/speak', label: 'Speak', icon: '🎤' },
  { href: '/stats', label: 'Stats', icon: '📊' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-pink-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 flex-1 py-2 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-pink-50 to-red-50 mx-1"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-xl z-10 relative">{tab.icon}</span>
              <span className={`text-[10px] font-semibold z-10 relative transition-colors ${
                isActive ? 'text-danish-red' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-danish-red"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
