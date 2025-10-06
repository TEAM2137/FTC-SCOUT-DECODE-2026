import Image from "next/image";

const Page = () => {
  return (
    <div className="
        font-sans grid grid-rows-[30px_1fr_100px] justify-items-center min-h-screen
        ">
        <div className="bg-slate-800 w-full flex flex-row row-start-1 items-start justify-items-center p-1">
            <Image src="/ui/FTC-SCOUT-white.svg" alt="FTC | SCOUTING APP" width={150} height={25} />
        </div>
        <main className="flex flex-row row-start-2 w-full">



        </main>
        <footer className="
        bg-slate-800 w-full
        row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            
            <Image src="/ui/TEAM2137-LOGO-horizontal.svg" alt="TEAM 2137 | The Oxford RoboCats" width={400} height={100} />

        </footer>
    </div>
  )
}

export default Page