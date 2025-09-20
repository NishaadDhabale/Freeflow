"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { Loader2 } from "lucide-react";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!name.trim()) return alert("Room name is required");
    setLoading(true);

    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name },
        {
          headers: {
            Authorization: localStorage.getItem("authorization") || "",
          },
        }
      );

      const roomId = res.data.roomId;
      router.push(`/canvas/${roomId}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-600 dark:bg-purple-500 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-purple-500 dark:border-gray-700 transition-all">
      <h2 className="text-2xl font-bold text-purple-300 dark:text-white mb-6 text-center">
        Create a New Room
      </h2>

      <input
        type="text"
        placeholder="Enter room name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition"
      />

      <button
        onClick={handleCreateRoom}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transform transition-all disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Room"
        )}
      </button>
    </div>
  );
}

