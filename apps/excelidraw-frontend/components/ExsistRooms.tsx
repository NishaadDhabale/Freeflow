'use client'

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Room = {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
};


export default function ExsistRooms(){
  const [roomsarray,setRoomsarray]= useState<Room[]>([]);
    const router=useRouter();
useEffect(()=>{
const fetchrooms=async()=>{


const res =await axios.get(`${HTTP_BACKEND}/rooms`,{
  headers:{
Authorization:localStorage.getItem("authorization")
  }})
setRoomsarray(res.data.messages||[])

}

fetchrooms();
},[])



return(
  <>
  <div className=' text-white'>{
    roomsarray.map((room)=>(
      <div className="cursor-pointer font-semibold font- " onClick={
        ()=>{
          router.push(`/canvas/${room.id}`)
        }
      } key={room.id}>
        {room.id} - {room.slug}
      </div>
    ))
    }


  </div>
  </>
)

}