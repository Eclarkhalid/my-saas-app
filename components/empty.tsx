import Image from "next/image"

interface EmptyProps {
  label: string
}

export const Empty = ({
  label
}: EmptyProps) => {
  return <>
    <div className="flex h-full p-20 flex-col items-center justify-center">
      <div className="relative h-96 w-96">
        <Image
          alt="Empty"
          fill
          src={'/images/empty.jpg'}
        />
      </div>
      <p className="text-sm text-center text-muted-foreground">
        {label}
      </p>
    </div>
  </>
}