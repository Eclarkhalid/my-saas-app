"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, Code, ImageIcon, MessageSquare, Music, Settings, Sparkles, VideoIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/chat"
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: '/image',
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: '/video',
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: '/music',
    color: "text-emerald-500",
    bgColor: "bg-emerald-700/10",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: '/code',
    color: "text-green-500",
    bgColor: "bg-green-700/10",
  },
  {
    label: "Blog Summarization",
    icon: Sparkles,
    href: '/summary',
    color: "text-red-500",
  },
]
export default function Dashboard() {

  const router = useRouter();

  return <>
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">
        Explore the power of AI
      </h2>
      <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
        Enjoy the smartest Ai Features - Explore the power of AI
      </p>
    </div>

    <div className="px-4 md:px-20 lg:px-32 space-y-4">
      {tools.map((tool) => (
        <Card key={tool.href}
          className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          onClick={() => router.push(tool.href)}
        >
          <div className="flex items-center gap-x-4">
            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
              <tool.icon className={cn("w-8 h-8", tool.color)} />
            </div>
            <div className="font-semibold">
              {tool.label}
            </div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Card>
      ))}
    </div>
  </>
}