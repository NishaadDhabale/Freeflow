'use client'
import CreateRoom from "@/components/CreateRoom";
import ExistRooms from "@/components/ExsistRooms";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className='bg-violet-500 min-h-screen w-full'>
      {/* Header */}
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <CreateRoom />
      </div>

      {/* Rooms Section */}
      <div className='flex-1 relative'>
        <div className="px-6 mb-4">
          <h2 className="text-white text-2xl font-semibold">Your Rooms</h2>
        </div>
        <div className="h-[calc(100vh-400px)]">
          <ExistRooms />
        </div>
      </div>
    </div>
  );
}