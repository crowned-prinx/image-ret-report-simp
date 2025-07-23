
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
        <>
            <DialogHeader>
                <DialogTitle>{title || "Title"}</DialogTitle>
              <DialogDescription>{description || "Description"}</DialogDescription>
            </DialogHeader>
            {children}
        </>
    );
  }
  return (
    <>
      <DrawerHeader className="text-left">
        <DrawerTitle>{title || "Title"}</DrawerTitle>
        <DrawerDescription>{description || "Description"}</DrawerDescription>
      </DrawerHeader>
      {children}
      <DrawerFooter className="pt-4">
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
