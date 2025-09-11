'use client'
import CreateRoom from "@/components/CreateRoom";
import ExsistRooms from "@/components/ExsistRooms";

export default function dashboard(){
  return(
    <div className='bg-slate-900 h-screen 100-vh flex'>
      <div className="text-white font-bold">
        hello
      </div>
      <div>
        <CreateRoom/>
      </div>
      <div className='flex justify-between'>
        <ExsistRooms/>
      </div>
    </div>
  )
}