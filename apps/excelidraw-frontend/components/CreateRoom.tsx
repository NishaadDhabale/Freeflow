"use client"
import { HTTP_BACKEND } from "@/config";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Canvas } from "./Canvas";

export default function CreateRoom(){
const [name,setName]=useState<String>();
const [roomid,setRoomid]=useState([])

const router=useRouter();
  return(
    <>
    <input type="text" placeholder="name" onChange={(e)=>{
      setName(e.target.value)
    }}/>
    <Button size="sm" variant='outline' children='Create Room' onClick={async()=>{
     const res = axios.post(`${HTTP_BACKEND}/room`,
        {
          name:name
        },
        {headers:{Authorization:localStorage.getItem('authorization')}}
      ).then((res)=>{
        const roomId =res.data.roomId
        router.push(`/canvas/${res.data.roomId}`)
     } )
    }} />
    </>
  )
}