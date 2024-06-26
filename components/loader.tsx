import Image from "next/image";

export const Loader = () => {
  return <>
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-20 h-10 relative animate-pulse">
        <Image alt="logo"
          fill
          src={'/images/egihub-orange-1.png'}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        ArtiFusion Is thinking ...
      </p>
    </div>
  </>
};