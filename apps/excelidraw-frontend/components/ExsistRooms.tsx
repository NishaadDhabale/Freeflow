'use client'
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

type Room = {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
};

export default function ExistRooms() {
  const [roomsArray, setRoomsArray] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const authToken = localStorage.getItem("authorization");
        if (!authToken) {
          throw new Error("No authorization token found");
        }

        const res = await axios.get(`${HTTP_BACKEND}/rooms`, {
          headers: {
            Authorization: authToken
          }
        });

        console.log("API Response:", res.data);
        setRoomsArray(res.data.messages || res.data.rooms || res.data || []);
      } catch (error: any) {
        console.error("Error fetching rooms:", error);
        setError(error.message || "Failed to fetch rooms");
        setRoomsArray([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const backgroundColors = [
    'bg-red-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-orange-200',
    'bg-teal-200',
    'bg-cyan-200'
  ];

  const handleRoomClick = (roomId: number) => {
    console.log("Navigating to room:", roomId);
    router.push(`/canvas/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <div className="text-white text-lg">Loading rooms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error loading rooms</div>
          <div className="text-white text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (roomsArray.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="text-center">
          <div className="text-white text-xl mb-2">No rooms found</div>
          <div className="text-gray-400">Create your first room to get started!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ScrollStack useWindowScroll={false}>
        {roomsArray.map((room, index) => {
          const bgColor = backgroundColors[index % backgroundColors.length];
          return (
            <ScrollStackItem
              key={`room-${room.id}`}
              onClick={() => handleRoomClick(room.id)}
              itemClassName={`${bgColor} hover:scale-105 transition-transform duration-200`}
            >
              <div className="w-full h-full flex flex-col justify-between p-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Room #{room.id}
                    </h3>
                    <div className="text-xs text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded">
                      ID: {room.id}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xl text-gray-700 font-semibold mb-2">
                      {room.slug || 'Untitled Room'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-400 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Created:</span> {new Date(room.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Admin:</span> {room.adminId}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Click to enter</div>
                      <div className="text-2xl">🚪</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </div>
  );
}