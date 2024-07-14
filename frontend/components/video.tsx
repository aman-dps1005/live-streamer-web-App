"useClient"
import { useEffect, useRef, useState } from "react"
import socket from "@/lib/socket";

export const VideoComponent=()=>{
    const [media,setMedia]=useState<MediaStream | null>(null);
    const [mediaRecorder,setMediaRecorder]=useState<MediaRecorder | null>(null);
    const userVideoRef=useRef<HTMLVideoElement>(null);

    async function startHandle(){
        if (media) {
            const recorder = new MediaRecorder(media, {
              audioBitsPerSecond: 128000,
              videoBitsPerSecond: 2500000,
            });
      
            recorder.ondataavailable = (ev) => {
              socket.emit("binaryStream", ev.data);
            };
      
            setMediaRecorder(recorder);
            recorder.start(25);
          } else {
            console.log("media stream not available");
          }
    }

    async function stopHandle(){
        if(mediaRecorder && mediaRecorder.state!=='inactive'){
            await mediaRecorder.stop();
            mediaRecorder.ondataavailable=null;
            setMediaRecorder(null);
            console.log("media stopped recording");
        }
        else{
            console.log("no active media recording");
        }
    }

    useEffect(()=>{
        const getUserMedia=async()=>{
            const mediaStream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
            if(userVideoRef.current){
                userVideoRef.current.srcObject=mediaStream;
            }
            setMedia(mediaStream);
        }
        getUserMedia();
    },[])
    return(
        <div className="flex w-full">
            <video className="rounded-xl" ref={userVideoRef}autoPlay muted></video>
            <div className="flex flex-col justify-between w-1/2">
                <div className="mx-20 w-full">
                    <button className="bg-green-400 w-full p-4 rounded-full" onClick={startHandle}>Start</button>
                </div>
                <div className="mx-20 w-full">
                    <button className="bg-red-500 w-full p-4 rounded-full" onClick={stopHandle}>Stop</button>
                </div>
            </div>
                
                
        </div>
    )
}