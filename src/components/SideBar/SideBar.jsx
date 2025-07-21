import React, { useState } from "react"

export default function SideBar() {
  const [shown, setShown] = useState(true)
  return (
    <aside className="bg-teal-700 w-fit flex flex-col">
      {/* Logo */}
      <div className="h-14 p-1 flex justify-between items-center mt-1 w-max">
        <img src={`/assets/images/dicomx-logo.png`} className={`h-full`} />
        <span
          className={`material-symbols-outlined ml-2 bg-black/50 p-2 rounded-md cursor-pointer`}>
          arrow_forward_ios
        </span>
      </div>

      <div className="h-full flex justify-center items-center font-roboto font-bold text-2xl overflow-scroll">
        Collaboration Panel
      </div>
    </aside>
  )
}
