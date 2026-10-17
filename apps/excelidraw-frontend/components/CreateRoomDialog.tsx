
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

interface CreateRoomDialogProps {
  onClose: () => void;
  onCreated: (roomId: number | string) => void;
}


export function CreateRoomDialog({ onClose, onCreated }: CreateRoomDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();

    if (cleanName.length < 3) {
      setError("Room name must be at least 3 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authorization");

      if (!token) {
        setError("Please sign in before creating a room.");
        return;
      }

      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: cleanName },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const roomId = res.data.roomId;

      if (!roomId) {
        throw new Error("The server did not return a room ID.");
      }

      onClose();
      router.push(`/canvas/${roomId}`);
    } catch (err: unknown) {
      console.error("Failed to create room:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to create room."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="create-room-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-[2px]"
        onMouseDown={(e) => {
          if (
            !loading &&
            e.target === e.currentTarget
          ) {
            onClose();
          }
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-room-title"
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#25252D] dark:text-white"
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777267] dark:text-gray-400">
                New workspace
              </p>

              <h2
                id="create-room-title"
                className="mt-2 text-xl font-semibold text-[#171717] dark:text-white"
              >
                Create a room
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Give your next collaboration a home.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close dialog"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-[#E8E8F0] disabled:opacity-50 dark:hover:bg-[#34343E]"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-[#34322C] dark:text-gray-200">
              Room name

              <input
                autoFocus
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Design brainstorm"
                maxLength={60}
                disabled={loading}
                className="mt-2 w-full rounded-lg border border-transparent bg-[#E8E8F0] px-4 py-3 text-[#171717] outline-none transition placeholder:text-gray-500 focus:border-[#171717]/20 focus:ring-2 focus:ring-[#E7DFA6] disabled:opacity-50 dark:bg-[#34343E] dark:text-white"
              />
            </label>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-lg bg-[#E8E8F0] px-4 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#DCDCE7] disabled:opacity-50 dark:bg-[#34343E] dark:text-white dark:hover:bg-[#41414D]"
              >
                Cancel
              </button>

              <motion.button
                whileHover={loading ? undefined : { y: -1 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[#E7DFA6] px-4 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#DED493] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating...
                  </span>
                ) : (
                  "Create room"
                )}
              </motion.button>
            </div>
          </form>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
