"use client"
import { useSearchParams } from "next/navigation"

export default function Error(){
    const searchParams = useSearchParams();
    console.log(searchParams.get("error"))
    return(
        <div className="bg-[#F9F9FA]">
            <div className="justify-between container mx-auto">
                <div className="flex gap-2 py-72 flex-col">
                    <p className="font-Bold text-red-600 text-9xl">НАСРАЛ</p>
                    <p className="font-Light text-black text-2xl"></p>    
                </div>
            </div>
        </div>

    )
}