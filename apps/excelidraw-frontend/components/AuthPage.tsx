'use client';

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router=useRouter()

  const [username,setUsername]= useState<String | null>();
  const [password,setPassword]= useState<String | null>();
  const [name,setName]=useState<String|null>()

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-6 m-2 bg-white rounded">
        <div className="p-2">
          {!isSignin && <input onChange={(e)=>{
            setName(e.target.value)
          }} type="text" placeholder="Name" />}
        </div>
        <div className="p-2">
          <input onChange={(e)=>{
            setUsername( e.target.value)

          }} type="text" placeholder="Email"></input>
        </div>
        <div
        className="p-2">
          <input  onChange={(e)=>{
          setPassword(e.target.value)}}  type="password" placeholder="Password" />
          </div>
        <div className="pt-2">
          <button className="bg-red-200 hover:bg-red-400 rounded p-2" onClick={() => {
            if(isSignin){
              axios.post(`${HTTP_BACKEND}/signin`,
                {
                  email:username,
                  password:password
                }
              ).then((res)=>{
                if(res.data.error){
                  alert(res.data.error)
                }else{
                const token =res.data.token;
                localStorage.setItem("authorization",token);
                router.push('/dashboard')}
              })
            }
            else{
              axios.post(`${HTTP_BACKEND}/signup`,{
                email:username,
                username:username,
                password:password,
                name:name

              }).then(()=>{
                router.push('/signin')
              })
            }
          }}>
            {isSignin ? 'Sign in' : 'Signup'}
          </button>
          </div>
          <div>
            <div>
              <br />
              <span onClick={()=>{
                isSignin? router.push('/signup'):router.push("/signin")
              }}className="cursor-pointer text-blue-700 hover:text-blue-900">
                                             {isSignin?'Not Signed in?':"Already Registered?"} </span>
         </div>
{/*
           <Button variant="secondary" size="lg" className="rounded-md bg-blue-400 hover:bg-red-500">
              {isSignin? 'Signup Now':'Signin Now'}
          </Button>
*/}
          </div>
      </div>

    </div>
  );
}
