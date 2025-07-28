"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [roomId,setRoomId] = useState("");
  return (
    <div className={styles.page}>
      <input type="text" placeholder="Room id" />
    </div>
  )
}
