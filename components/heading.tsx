import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColour?: string;
}

const Heading = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColour,
}: HeadingProps) => {
  return <>
    <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
      <div className={cn("p-2 w-fit rounded-md ", bgColour)}>
        <Icon className={cn("w-10 h-10", iconColor)} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  </>;
}

export default Heading;