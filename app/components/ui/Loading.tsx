'use client'
import Image from "next/image"

const Loading = () => {
  return (
    <div className="absolute w-1/2 top-1/4 left-1/4 justify-start place-items-center z-250">
      <Image className="w-1/2 h-1/2" src="/ui/Orange-Loader.gif" alt="loading" width="100" height="100" layout="intrinsic" />  
    </div>
  )
}

export default Loading