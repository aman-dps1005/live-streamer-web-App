"use client"
import {VideoComponent} from "./video"
import {RecoilRoot} from "recoil";

export default function TransmissionComponent(){
    return (
        <div className="flex h-screen w-screen bg-gradient-to-r from-slate-900 via-slate-600 to-red-50">
            <div className="p-8">
                <VideoComponent/>
                
            </div>
        </div>
    )
}