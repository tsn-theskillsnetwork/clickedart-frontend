import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen mb-10 mt-5">
      <div className="flex flex-col sm:flex-row justify-center">
        <div className="flex flex-col gap-4 sm:w-8/12 px-4">
          <div className="flex flex-col">
            <Skeleton className="w-1/2 h-8" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <Skeleton className="w-4/5 h-96" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
        <div className="flex flex-col mt-4 sm:mt-0 sm:w-1/5 px-4">
          <div className="flex flex-col gap-4 sm:pt-28">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
