"use client"

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, Sparkles, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { FreeCounter } from "./free-counter";

const poppins = Poppins({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500",
  },
  {
    label: "Chat",
    icon: MessageSquare,
    href: '/chat',
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: '/image',
    color: "text-pink-700",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: '/video',
    color: "text-orange-700",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: '/music',
    color: "text-emerald-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: '/code',
    color: "text-green-500",
  },
  {
    label: "Blog Summarization",
    icon: Sparkles,
    href: '/summary',
    color: "text-red-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: '/settings',
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
};


const SideBar = ({
  apiLimitCount = 0,
  isPro = false,
}: SidebarProps) => {
  const pathname = usePathname();

  return <>
    <div className="space-y-4 py-4 flex flex-col h-full  ">
      <div className="px-3 py-2 flex-1">
        <Link href={'/dashboard'} className="flex items-center pl-3 mb-14">
          <div className="relative w-16 h-8 mr-4">
            <Image
              fill
              alt="Logo"
              src='/images/egihub-orange-1.png'
            />
          </div>
          <h1 className={cn("text-2xl font-bold text-white", poppins.className)}>
            ArtiFusion
          </h1>
        </Link>
        <div className="space-y-1">
          {
            routes.map((route) => (
              <Link href={route.href}
                key={route.href}
                className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-gray-100 rounded-lg transition hover:bg-white/10",
                  pathname === route.href ? "text-[#111827] bg-gray-200" : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))
          }
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} />
    </div>
  </>;
}

export default SideBar;