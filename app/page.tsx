import Image from "next/image";

export default function Home() {
  return (
    <div className="
    bg-[url('/ui/FIRST-AGE-IG-blankpost.png')] bg-cover bg-center bg-no-repeat
    font-sans grid grid-rows-[30px_1fr_100px] justify-items-center min-h-screen
    ">
      <div className="bg-slate-800 w-full flex flex-row row-start-1 items-start justify-items-center p-1">
          <Image src="/ui/FTC-SCOUT-white.svg" alt="FTC | SCOUTING APP" width={150} height={25} />
      </div>
      <main className="flex flex-row row-start-2 w-full">
        
        <div className="hidden sm:flex flex-col w-[50%] bg-slate-600 items-center justify-items-center">
        <Image src="/ui/first_age_logo_stacked_rgb_fullcolorreverse.svg" alt="FIRST AGE | LOGO" width={300} height={250} />
        <Image src="/ui/first_age_ftc_decode_logo_vertical_rgb_fullcolorreverse.svg" alt="FTC DECODE 2026 | LOGO" width={500} height={500} />
        </div>
        <div className="flex flex-col w-full sm:w-[50%] place-items-center justify-items-center text-slate-800 pt-8">
          <h1 className="text-2xl font-black ">WELCOME TO FTC SCOUT!</h1>
          <p className="text-md font-bold italic">
            Scouting app for FIRST&copy; Tech Challenge 2026
          </p>
          <div className="flex sm:hidden flex-row justify-items-center">
            <Image src="/ui/first_age_logo_stacked_rgb_fullcolor.svg" alt="FIRST AGE | LOGO" width={200} height={250} />
            <Image src="/ui/first_age_ftc_decode_logo_vertical_rgb_fullcolor.svg" alt="FTC DECODE 2026 | LOGO" width={200} height={500} />
          </div>
          <p className="text-md sm:text-lg font-semibold italic pt-4 px-4 ">
            This app is designed to help you scout teams during the FTC 2026 season. You can use it to record match data, team information, and more.
          </p>
        </div>
      </main>
      <footer className="
      bg-slate-800 w-full
      row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
        <Image src="/ui/TEAM2137-LOGO-horizontal.svg" alt="TEAM 2137 | The Oxford RoboCats" width={400} height={100} />

      </footer>
    </div>
  );
}
