"use client"

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideBar from "./sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface MobileSidebarProps {
  apiLimitCount: number;
  isPro: boolean;
};

const MobileSidebar = ({
  apiLimitCount=0,
  isPro=false,
}: MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>
    <Sheet>
      <SheetTrigger>
        <Button variant='ghost' size='icon' className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SideBar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  </>;
}

export default MobileSidebar;