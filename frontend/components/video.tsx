"useClient"
import { useEffect, useRef } from "react"

export const VideoComponent=()=>{
    const userVideoRef=useRef<HTMLVideoElement>(null);
    useEffect(()=>{
        const getUserMedia=async()=>{
            const mediaStream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
            if(userVideoRef.current){
                userVideoRef.current.srcObject=mediaStream;
            }
        }
        getUserMedia();
    },[])
    return(
        <div className="flex w-full">
            <video className="rounded-xl" ref={userVideoRef}autoPlay muted></video>
            <div className="flex flex-col justify-between w-1/2">
                <div className="mx-20 w-full">
                    <button className="bg-green-400 w-full p-4 rounded-full">Start</button>
                </div>
                <div className="mx-20 w-full">
                    <button className="bg-red-500 w-full p-4 rounded-full">Stop</button>
                </div>
            </div>
                
                
        </div>
    )
}