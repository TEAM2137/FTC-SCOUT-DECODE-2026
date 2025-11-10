'use client'

import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <div className="flex flex-row w-full h-[30px] p-1.5">
      <div className="flex flex-row place-items-center gap-2 ml-2">
        <Image src="/icons/orange.svg" alt="logo" width={20} height={20} />
        <Link href="/" className="text-white">
        <Image src="/ui/FTC-SCOUT-white.svg" alt="logo" width={132} height={20} />
        </Link>
      </div>
      <div className="ml-auto mr-2">
        <Link href="/" className="text-white text-xs font-bold">HOME</Link> | <Link href="/scout/" className="text-white text-xs font-bold">EVENTS</Link>
      </div>
      
    </div>
  )
}

export default Header