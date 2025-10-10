import Image from "next/image";
import Link from 'next/link';
import AuthMenu from "@/app/components/auth/AuthMenu";
import Footer from "@/app/components/Footer";



export default function Home() {
  return (
    <div className="
    bg-[url('/ui/FIRST-AGE-IG-blankpost.png')] 
    bg-cover bg-center bg-no-repeat
    font-sans 

    grid grid-rows-[30px_1fr_100px] justify-items-center min-h-screen
    ">

      <div className="
      bg-slate-900 
      w-full 
      flex flex-row 
      row-start-1 items-start justify-items-center p-1">

          <Image src="/ui/FTC-SCOUT-white.svg" alt="FTC | SCOUTING APP" width={150} height={25} />
      
      </div>


      <main className="flex flex-row row-start-2 w-full">
        
        <div className="hidden sm:flex flex-col w-[50%] bg-slate-600 items-center justify-items-center">
        <Image src="/ui/first_age_logo_stacked_rgb_fullcolorreverse.svg" alt="FIRST AGE | LOGO" width={0} height={150} />
        <Image src="/ui/first_age_ftc_decode_logo_vertical_rgb_fullcolorreverse.svg" alt="FTC DECODE 2026 | LOGO" width={600} height={600} />
        </div>
        <div className="flex flex-col w-full sm:w-[50%] place-items-center justify-items-center text-slate-800 pt-8">
          <h1 className="text-2xl sm:text-3xl font-black ">WELCOME TO FTC SCOUT!</h1>
          <p className="text-md font-bold italic">
            Scouting app for FIRST&copy; Tech Challenge 2026
          </p>
          <div className="flex sm:hidden flex-row justify-items-center">
            <Image src="/ui/first_age_logo_stacked_rgb_fullcolor.svg" alt="FIRST AGE | LOGO" width={200} height={250} />
            <Image src="/ui/first_age_ftc_decode_logo_vertical_rgb_fullcolor.svg" alt="FTC DECODE 2026 | LOGO" width={200} height={500} />
          </div>
          <p className="text-md sm:text-lg font-semibold italic pt-4 px-4 w-[98%] mx-auto">
            This app is designed for any FTC team to browse event and team data. With a login you can use it to record match data, review results, and prepare for alliance selection. Good luck and have fun!
          </p>

        <div className="flex flex-row flex-wrap place-self-center items-center justify-items-center min-w-[100%] p-8">
          <Link href="/decode">
          <button className="mt-4 bg-blue-900 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white 
          font-bold m-auto py-2 px-4 rounded-xl w-[96%]">
              <h1 className="text-xl sm:text-lg md:text-2xl m-2">Browse Events & Teams</h1>
              <p className="text-sm sm:text-xs font-normal italic ">
                Click here to get started reviewing data for events and teams. You will need to login to your team account in order to collect and manage your data.
              </p>
          </button>
          </Link>
        </div>

          <AuthMenu />


        </div>
      </main>
      <footer className="
      bg-slate-800 w-full
      row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
        <Footer />

      </footer>
    </div>
  );
}
