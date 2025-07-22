
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
 
DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "./utils/use-media-query";

export function SuccessModal({ children, title, description }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
        <DialogContent className="sm:max-w-[1024px] min-w-[200px] !bg-neutral-800 mx-5 h-[95vh] text-white/50 border border-white">
            <DialogTitle>{title}</DialogTitle>
            <DialogHeader>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
        </DialogContent>
    );
  }
  return (
    <DrawerContent className="!bg-neutral-800 text-white/50">
      <DrawerHeader className="text-left">
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      {children}
      <DrawerFooter className="pt-4">
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
