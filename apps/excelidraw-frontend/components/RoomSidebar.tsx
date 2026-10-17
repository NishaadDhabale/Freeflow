'use client';

import { motion, type Variants } from 'framer-motion';
import {
  DoorOpen,
  LayoutDashboard,
  LogOut,
  PanelsTopLeft,
  Settings2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard', label: 'Your rooms', icon: DoorOpen },
];
const itemMotion: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RoomSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  function logout() {
    // Replace with your auth provider's signOut() or logout API call.
    router.push('/signin');
  }
  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 flex w-full shrink-0 flex-col rounded-t-2xl bg-white px-3 py-4 dark:bg-[#242420] sm:px-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:rounded-l-2xl lg:rounded-r-none lg:px-3"
    >
      <Link href="/rooms" className="mb-8 flex items-center gap-3 px-2 py-1">
        <span className="grid size-9 place-items-center rounded-xl bg-[#111111] text-white">
          <PanelsTopLeft size={19} />
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-tight text-[#171717] dark:text-white">
            FreeFlow
          </span>
          <span className="text-xs text-[#898477] dark:text-[#B6B1A4]">
            Your creative space
          </span>
        </span>
      </Link>
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#989386]">
        Workspace
      </p>
      <motion.nav
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.065 } },
        }}
        initial="hidden"
        animate="show"
        className="flex gap-1.5 lg:flex-col lg:gap-1"
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href === '/rooms' && pathname.startsWith('/room/')) ||
            pathname.startsWith('/canvas/');
          return (
            <motion.div
              key={href}
              variants={itemMotion}
              className="min-w-0 flex-1 lg:flex-none"
            >
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-full items-center gap-2.5 rounded-lg px-3 py-3 text-sm transition-colors lg:rounded-r-none lg:rounded-l-lg lg:py-3.5 ${active ? 'bg-[#E8E8F0] font-semibold text-[#171717] dark:bg-[#22221F] dark:text-white lg:mr-[-12px] lg:pr-6' : 'text-[#625F56] hover:bg-[#F8F6EF] dark:text-[#C8C3B6] dark:hover:bg-[#30302B]'}`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span className="truncate">{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>
      <div className="mt-auto hidden pt-6 lg:block">
        <div className="rounded-xl bg-[#F8F6EF] p-3 dark:bg-[#2E2E29]">
          <div className="mb-2 grid size-8 place-items-center rounded-lg bg-white text-[#625F56] dark:bg-[#242420] dark:text-[#F4EED1]">
            <PanelsTopLeft size={16} />
          </div>
          <p className="text-sm font-medium text-[#34322C] dark:text-[#F8F6EF]">
            Make room for ideas.
          </p>
          <p className="mt-1 text-xs leading-5 text-[#777267] dark:text-[#B6B1A4]">
            Bring your team together in one shared space.
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="mt-4 flex items-center gap-2.5 rounded-lg px-3 py-3 text-left text-sm text-[#777267] transition hover:bg-[#F8F6EF] hover:text-[#171717] dark:text-[#B6B1A4] dark:hover:bg-[#30302B] dark:hover:text-white"
      >
        <LogOut size={17} />
        Log out
      </motion.button>
    </motion.aside>
  );
}
