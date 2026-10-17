
"use client";

import dynamic from "next/dynamic";

const ExcalidrawClient = dynamic(
  () => import("./ExcalidrawClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        Loading canvas...
      </div>
    ),
  }
);

export default function CanvasLoader() {
  return <ExcalidrawClient />;
}
