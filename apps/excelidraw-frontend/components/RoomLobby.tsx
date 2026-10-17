'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Plus,
  Search,
  Users,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HTTP_BACKEND } from '@/config';
import { CreateRoomDialog } from '@/components/CreateRoomDialog';
import { RoomCard, type BackendRoom } from '@/components/RoomCard';
import { RoomSidebar } from '@/components/RoomSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } },
};
type ApiResponse =
  | { rooms?: BackendRoom[]; messages?: BackendRoom[] }
  | BackendRoom[];

export function RoomLobby() {
  const [rooms, setRooms] = useState<BackendRoom[]>([]);
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const router = useRouter();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const token = localStorage.getItem('authorization');
      if (!token) {
        setRooms([]);
        setLoadError('Please sign in to view your rooms.');
        return;
      }
      const response = await axios.get<ApiResponse>(`${HTTP_BACKEND}/rooms`, {
        headers: { Authorization: token },
      });
      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : (data.rooms ?? data.messages ?? []);
      setRooms(
        list.filter(
          (room) =>
            room && room.id !== undefined && typeof room.slug === 'string',
        ),
      );
    } catch (error: unknown) {
      console.error('Error fetching rooms:', error);
      setLoadError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? 'Failed to fetch rooms.')
          : 'Failed to fetch rooms.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const filteredRooms = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value
      ? rooms.filter((room) =>
          `${room.slug} ${room.id} ${room.adminId}`
            .toLowerCase()
            .includes(value),
        )
      : rooms;
  }, [rooms, query]);

  async function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      setJoinError('Enter a room name or room ID first.');
      return;
    }

    try {
      setJoinError('');

      const token = localStorage.getItem('authorization');

      const response = await axios.get(
        `${HTTP_BACKEND}/room/${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: token || '',
          },
        },
      );

      const room = response.data?.room;

      if (!room?.id) {
        setJoinError('Room not found.');
        return;
      }

      router.push(`/canvas/${room.id}`);
    } catch (error: any) {
      console.error('Failed to join room:', error);

      setJoinError(
        error.response?.data?.message ||
          'Room not found. Check the room name or ID.',
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFCFC] p-3 text-[#171717] transition-colors dark:bg-[#17171B] dark:text-[#F8F6EF] sm:p-5 lg:p-6">
      <div className="mx-auto grid max-w-[1560px] items-stretch gap-0 lg:grid-cols-[236px_minmax(0,1fr)]">
        <RoomSidebar />
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="min-w-0 rounded-b-2xl bg-[#E8E8F0] px-4 py-5 dark:bg-[#222229] sm:px-6 sm:py-6 lg:rounded-l-none lg:rounded-r-2xl lg:px-8 lg:py-7"
        >
          <motion.header
            variants={rise}
            className="mb-7 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-[#777267] dark:text-[#B6B1A4]">
                FreeFlow workspace
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[30px]">
                Your rooms
              </h1>
              <p className="mt-1 text-sm text-[#777267] dark:text-[#B6B1A4]">
                Pick up where you left off.
              </p>
            </div>
            <ThemeToggle />
          </motion.header>
          <motion.section
            variants={rise}
            className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.65fr)]"
          >
            <div className="rounded-2xl bg-white p-5 sm:p-6 dark:bg-[#2B2B33]">
              <p className="text-xs text-[#777267] dark:text-[#B6B1A4]">
                A DIGITAL WORKSPACE FOR YOUR IDEAS
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">
                Collaborate. Organize.{' '}
                <span className="font-normal">Create.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#777267] dark:text-[#B6B1A4]">
                Join a shared room or make a little space for your next big
                idea.
              </p>
              <form
                onSubmit={joinRoom}
                className="mt-5 flex max-w-2xl flex-col gap-2 rounded-xl bg-[#E8E8F0]/70 p-2 sm:flex-row dark:bg-[#202027]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Search size={18} className="shrink-0 text-[#898477]" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setJoinError('');
                      setNotice('');
                    }}
                    placeholder="Enter room slug or ID..."
                    aria-label="Room slug or ID"
                    className="w-full min-w-0 bg-transparent py-2 text-sm text-[#171717] outline-none placeholder:text-[#969184] dark:text-white"
                  />
                </div>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#E7DFA6] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#DED493]"
                >
                  Join room <ArrowRight size={16} />
                </motion.button>
              </form>
              {joinError && (
                <p role="alert" className="mt-2 text-sm text-[#A33B32]">
                  {joinError}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowCreate(true)}
                className="flex flex-1 items-center gap-4 rounded-2xl bg-[#E7DFA6] p-5 text-left transition hover:bg-[#DED493]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/70 text-[#222222]">
                  <Plus size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Create a room</span>
                  <span className="mt-1 block text-sm text-[#625D43]">
                    Start a fresh shared space.
                  </span>
                </span>
                <ArrowRight size={17} />
              </motion.button>
              <Link
                href="/canvas2"
                className="group flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 transition hover:bg-[#F5F5F8] dark:bg-[#2B2B33] dark:hover:bg-[#33333D]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E8E8F0] text-[#29271F] dark:bg-[#202027] dark:text-[#F4EED1]">
                  <DoorOpen size={21} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Excalidraw UI</span>
                  <span className="mt-1 block text-sm text-[#777267] dark:text-[#B6B1A4]">
                    Explore Excalidraw Library.
                  </span>
                </span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.section>
          <AnimatePresence>
            {notice && (
              <motion.p
                key="notice"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                role="status"
                className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-[#4F6B3C] dark:bg-[#2B2B33] dark:text-[#C5D8B4]"
              >
                <CheckCircle2 size={17} />
                {notice}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.section
            variants={rise}
            className="rounded-2xl bg-white p-4 sm:p-6 dark:bg-[#2B2B33]"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#777267] dark:text-[#B6B1A4]">
                  Your shared spaces
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Existing rooms{' '}
                  <span className="ml-1 align-middle text-sm font-normal text-[#777267] dark:text-[#B6B1A4]">
                    {filteredRooms.length}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => void fetchRooms()}
                className="flex items-center gap-2 text-xs text-[#777267] hover:text-[#171717] dark:text-[#B6B1A4]"
                disabled={loading}
              >
                <RefreshCw
                  size={14}
                  className={loading ? 'animate-spin' : ''}
                />{' '}
                Refresh rooms
              </button>
            </div>
            {loading ? (
              <div className="py-14 text-center text-sm text-[#777267] dark:text-[#B6B1A4]">
                Loading your rooms…
              </div>
            ) : loadError ? (
              <div className="rounded-xl bg-[#E8E8F0]/60 px-5 py-10 text-center dark:bg-[#202027]">
                <p className="font-semibold">Couldn’t load rooms</p>
                <p className="mt-1 text-sm text-[#777267] dark:text-[#B6B1A4]">
                  {loadError}
                </p>
                <button
                  onClick={() => void fetchRooms()}
                  className="mt-4 rounded-lg bg-[#E7DFA6] px-4 py-2 text-sm font-semibold text-[#171717]"
                >
                  Try again
                </button>
              </div>
            ) : filteredRooms.length ? (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onOpen={() => router.push(`/canvas/${room.id}`)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-[#E8E8F0]/60 px-5 py-12 text-center dark:bg-[#202027]"
              >
                <Search size={22} className="mx-auto text-[#898477]" />
                <h3 className="mt-4 font-semibold">
                  {query ? 'No matching rooms' : 'No rooms yet'}
                </h3>
                <p className="mt-1 text-sm text-[#777267] dark:text-[#B6B1A4]">
                  {query
                    ? 'Try a different room slug or ID.'
                    : 'Create your first room to get started.'}
                </p>
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setJoinError('');
                    }}
                    className="mt-4 text-sm font-semibold underline underline-offset-4"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </motion.section>
          <motion.footer
            variants={rise}
            className="px-2 pb-1 pt-5 text-center text-xs text-[#898477] dark:text-[#B6B1A4]"
          >
            A calmer space to think, create, and collaborate.
          </motion.footer>
        </motion.section>
      </div>
      <AnimatePresence>
        {showCreate && (
          <CreateRoomDialog
            onClose={() => setShowCreate(false)}
            onCreated={(roomId) => {
              setShowCreate(false);
              setNotice('Room created successfully.');
              void fetchRooms();
              router.push(`/canvas/${roomId}`);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
