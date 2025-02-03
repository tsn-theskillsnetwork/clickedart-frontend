import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ImageSkeleton() {
  return (
    <div className={`px-5 lg:px-20 min-h-screen`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 pt-10 bg-[#FBFBFB] -mt-2">
        <div className="lg:col-span-2 flex flex-col gap-10  h-full">
          <div className="flex justify-center sticky top-32">
            {/* <ImageSection selectedFrame={selectedFrame} image={image} /> */}
            <Skeleton className="w-full lg:w-4/6 aspect-[4/3]" />
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-2 gap-4">
            <div className={`border-4 border-blue-400`}>
              <Skeleton className="h-24 border-4 border-white shadow-[0_0_4px_rgba(0,0,0,0.7)]" />
            </div>
            <div className={`border-4 border-transparent`}>
              <Skeleton className="h-24 border-4 border-white shadow-[0_0_4px_rgba(0,0,0,0.7)]" />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4 ">
            <Skeleton className="w-full h-6 lg:h-12" />
            <Skeleton className="w-1/2 h-4 lg:h-6" />
            <Skeleton className="w-1/4 h-4 lg:h-6" />
          </div>
          <div className="hidden lg:block">
            <div className="flex flex-col gap-10 mt-10">
              <Skeleton className="w-full h-16 rounded-full" />
              <Skeleton className="w-full h-10" />
              <div className="flex justify-between gap-10">
                <Skeleton className="w-full h-16 rounded-md" />
                <Skeleton className="aspect-[1/1] h-16 rounded-lg" />
              </div>
            </div>
          </div>
          {/* <div className="hidden lg:block">{buySection}</div> */}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex flex-col gap-5 mt-10">
          <Skeleton className="w-1/4 h-12 " />
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-1/2 h-8" />
        </div>
      </div>
      <div className="lg:hidden block">
        <div className="flex flex-col gap-5 mt-10">
          <Skeleton className="w-full h-32 rounded-md shadow-md" />
        </div>
      </div>
      <div className="fixed bottom-4 left-0 right-0 lg:hidden px-4">
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
    </div>
  );
}
