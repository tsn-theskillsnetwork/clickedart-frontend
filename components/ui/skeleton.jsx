import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse bg-gradient-to-tr from-[#e8e8e8] to-[#d0d0d0]", className)}
      {...props} />)
  );
}

export { Skeleton }
