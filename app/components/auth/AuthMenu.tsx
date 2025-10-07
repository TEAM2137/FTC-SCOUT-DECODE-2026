'use client'

const AuthMenu = () => {
  return (
    <div className="flex flex-row flex-wrap justify-items-center min-w-[98%] px-6 mb-4 mx-auto">
        <p className="text-sm sm:text-md font-semibold italic pt-4 px-4 w-[98%] mx-auto">
            Login to Scout or Mange your team and data. If your team is not registered, you can have a mentor register to give your team access.
        </p>
        <button className="mt-4 bg-slate-800 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white font-bold m-auto py-6 px-4 rounded-xl w-[92%] sm:w-[44%]">
            <h1 className="text-2xl">Scouting Login</h1>
        </button>
        <button className="mt-4 bg-slate-800 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white font-bold m-auto py-6 px-4 rounded-xl w-[92%] sm:w-[44%]">
            <h1 className="text-2xl">Admin Login</h1>
            
        </button>
        <button className="mt-4 bg-slate-800 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white font-bold m-auto py-2 px-4 rounded-xl w-[92%] sm:w-[94%]">
            <h1 className="text-2xl">Team Registration</h1>
            
        </button>
    </div>
  )
}

export default AuthMenu