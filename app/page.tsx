import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className='flex flex-row w-full min-h-screen mb-25'>

      <div className="hidden sm:flex flex-col w-1/2 justify-start place-items-center">
        
        <Image src="/ui/first_age_logo_stacked_rgb_fullcolorreverse.svg" alt="logo" width={300} height={300} />
        <Image src="/ui/first_age_ftc_decode_logo_vertical_rgb_fullcolorreverse.svg" alt="logo" width={300} height={300} />

      </div>

      <div className="flex flex-col w-full sm:w-1/2 p-2 text-black justify-start place-items-start bg-[url('/ui/FIRST-AGE-IG-blankpost.png')] bg-cover bg-center">
        
        <div className="w-full">
          <h1 className="text-xl sm:text-xl font-black ">WELCOME TO FTC SCOUT!</h1>
          <p className="text-md font-bold italic">
            Scouting app for FIRST<span className="text-xs">&reg;</span> Tech Challenge 2026
          </p>
        </div>

        <div className="sm:hidden flex flex-row gap-2 w-full">
          <div className="flex w-1/2 justify-center place-items-center pl-4"><Image src="/ui/first_age_logo_stacked_rgb_fullcolor.svg" alt="logo" width={200} height={150} objectFit="contain" /></div>
          <div className="flex w-1/2 justify-center place-items-center pr-4"><Image src="/ui/first_age_ftc_decode_logo_vertical_rgb_fullcolor.svg" alt="logo" width={200} height={150} objectFit="contain" /></div>
        </div>

        <div className="w-full">
          <p className="text-md sm:text-lg font-semibold italic pt-4 px-4 w-[99%] mx-auto">
            This app is designed for any FTC team to browse event and team data. With a login you can use it to record match data, review results, and prepare for alliance selection. Good luck and have fun!
          </p>
        </div>

        <div className="flex flex-row flex-wrap place-self-center items-center justify-items-center p-8">
          <Link href="/scout">
          <button className="mt-4 bg-blue-900 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white 
          font-bold m-auto py-2 px-4 rounded-xl w-[96%]">
              <h1 className="text-xl sm:text-lg md:text-2xl m-2">Browse Events</h1>
              <p className="text-sm sm:text-xs font-normal italic ">
                Click here to get started reviewing data for events and teams. You will need to login to your team account in order to collect and manage your data.
              </p>
          </button>
          </Link>
        </div>

      </div>
      
    </div>
  );
}
     