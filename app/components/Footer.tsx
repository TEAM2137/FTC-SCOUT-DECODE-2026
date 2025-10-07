'use client'
import Image from "next/image";
import { useState } from "react";


const Footer = () => {
    const [showAbout, setShowAbout] = useState(false);

  return (<div>
    <div className={showAbout ? "flex flex-col items-center justify-items-center" : "hidden w-full flex-col items-center justify-items-center"}>

            <div className="absolute top-0 right-0 min-w-screen min-h-[1000px] flex flex-col items-center justify-items-center p-1 z-100 bg-slate-300">
                <div className="flex flex-row flex-wrap-reverse bg-slate-300  p-2 m-auto rounded-lg absolute top-[30px] left-1/2 transform -translate-x-1/2 min-w-[90%] sm:min-w-[95%] ">
                    <div className="min-w-[300px] w-[90%] sm:w-[65%] text-stone-950 p-2 m-auto">
                        <h1 className="text-2xl font-bold">About Our Team & App</h1>
                        <p className="text-md sm:text-lg font-normal italic mt-4">
                            TEAM 2137, The Oxford RoboCats, is a FIRST&copy; Robotics Competition team from Oxford, Michigan. We are Oxford&apos;s first robotics team, now entering our 20th season. Our team is dedicated to promoting STEM education and inspiring the next generation of innovators.
                        </p>
                        <p className="text-md sm:text-lg font-normal italic mt-4">
                            This scouting app was developed by our team to help FTC teams collect and analyze match data more effectively. We believe that good data can lead to better strategies and more successful competitions. We hope this app serves your team well throughout the FTC 2026 season and beyond!
                        </p>
                        <p className="text-md sm:text-lg font-normal italic mt-4">
                            If you have any questions, feedback, or would like to learn more about our team, please feel free to reach out to us at <a className="underline" href="mailto:team2137@gmail.com">info@team2137.com</a>.
                        </p>
                        <button className="mt-4 bg-slate-900 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white font-bold m-auto py-2 px-4 rounded-xl w-[96%]" onClick={() => setShowAbout(!showAbout)}>close</button>
                    </div>
                    <div className="min-w-[300px] w-[90%] sm:w-[35%] items-center justify-items-center m-auto">
                        <Image className="m-auto" src="/ui/TORC-icon-512.svg" alt="TEAM 2137" width={300} height={300} />
                    </div>
                
                </div>
            </div>
    </div>





        <button className="bg-slate-800 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white 
        font-bold mx-auto p-1 rounded-xl w-[98%] items-center justify-items-center"
        onClick={() => setShowAbout(!showAbout)}>
          <Image src="/ui/TEAM2137-LOGO-horizontal.svg" alt="TEAM 2137 | The Oxford RoboCats" width={300} height={75} />
        </button>

        
    </div>
  )
}

export default Footer