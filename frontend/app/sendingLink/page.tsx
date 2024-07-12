"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendLinkcard(){
    const router=useRouter();
    const [link,setLink]=useState("");
    const [apiKey,setApiKey]=useState("");
    const {toast}=useToast();
    const handleClick=async()=>{
        const response=await axios.post("http://localhost:8080/streamId",{
            url:link,
            apiKey:apiKey
        })
        toast({
            title: "Sent the link to server",
            description: response.data,
        })
        router.push("/transmission")
        console.log(response.data);
    }
    return (
        <div className="h-screen flex items-center justify-center flex-col bg-gradient-to-r from-slate-900 via-slate-600 to-red-50">
        <Card className="w-full max-w-sm rounded-xl bg-gradient-to-r from-slate-400 via-violet-600 to-violet-100">
      <CardHeader>
        <CardTitle className="text-2xl">Stream Link</CardTitle>
        <CardDescription>
          Enter your stream link and api key here
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">Link</label>
          <input id="email" onChange={e=>setLink(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="rtmp://....." required />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password">API key</label>
          <input id="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e)=>setApiKey(e.target.value)}required />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <button className=" bg-black text-white p-3 rounded-xl" onClick={handleClick}>Send to Server</button>
      </CardFooter>
    </Card>
        </div>

    )
}