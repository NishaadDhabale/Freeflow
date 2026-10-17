
"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export default function ExcalidrawClient() {
  return (
    <div className="h-screen w-full ">
      <Excalidraw />
    </div>
  );
}
