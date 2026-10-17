"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, CalendarDays, Hash, UserRound } from "lucide-react";

export type BackendRoom = { id: number; slug: string; createdAt: string; adminId: string };
const cardMotion: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } },
};

export function RoomCard({ room, onOpen }: { room: BackendRoom; onOpen: () => void }) {
  const createdDate = room.createdAt ? new Date(room.createdAt) : null;
  const createdLabel = createdDate && !Number.isNaN(createdDate.getTime()) ? createdDate.toLocaleDateString() : "Date unavailable";
  return <motion.button type="button" variants={cardMotion} layout initial="hidden" animate="show" exit="exit" whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} onClick={onOpen} className="group min-w-0 rounded-xl bg-white p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7DFA6] dark:bg-[#2B2B33]">
    <div className="flex aspect-square flex-col justify-between rounded-lg bg-[#E8E8F0] p-4 dark:bg-[#202027]"><div className="flex items-start justify-between gap-2"><span className="grid size-10 place-items-center rounded-lg bg-white text-sm font-semibold text-[#171717] dark:bg-[#34343D] dark:text-white">{room.slug?.trim().charAt(0).toUpperCase() || "R"}</span><span className="grid size-8 place-items-center rounded-full text-[#777267] transition group-hover:bg-[#E7DFA6] group-hover:text-[#171717] dark:text-[#B6B1A4]"><ArrowUpRight size={17}/></span></div><div><h3 className="truncate text-lg font-semibold text-[#171717] dark:text-[#F8F6EF]">{room.slug || `Room ${room.id}`}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-[#777267] dark:text-[#B6B1A4]"><Hash size={12}/>Room ID: {room.id}</p></div></div>
    <div className="mt-3 flex flex-col gap-2 text-xs text-[#777267] dark:text-[#B6B1A4]"><span className="flex items-center gap-1.5"><CalendarDays size={13}/>Created {createdLabel}</span></div>
  </motion.button>;
}
