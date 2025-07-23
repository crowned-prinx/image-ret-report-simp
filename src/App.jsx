import { useState } from "react"
import Main from "./components/Main/Main"
import NavBar from "./components/NavBar/NavBar"
import SideBar from "./components/SideBar/SideBar"
import { Toaster } from "./components/ui/sonner"
import { Dialog, DialogContent } from "./components/ui/dialog"
import { useMediaQuery } from "./components/utils/use-media-query"
import { DrawerContent } from "./components/ui/drawer"

export default function App() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [content, setContent] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isDesktop ? (
          <DialogContent className="sm:max-w-[1024px] min-w-[200px] !bg-neutral-800 h-[95vh] text-white/50">
            {content}
          </DialogContent>
        ) : (
          <DrawerContent className="!bg-neutral-800 text-white/50">{content}</DrawerContent>
        )}
    <div className="h-full overflow-hidden">
      <div className="w-full">
         <Toaster
          position="top-right"
          dir="ltr"
          richColors
          closeButton
          gap={8}
          offset={16}
        />
        <Main setContent={setContent} setOpen={setOpen}/>
      </div>
    </div>
    </Dialog>
  )
}
