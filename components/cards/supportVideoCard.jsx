import React from "react";

export default function SupportVideoCard({ video }) {
  const getVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    } catch (error) {
      return null;
    }
  };

  const videoId = getVideoId(video.url);

  return (
    <div className="w-full flex flex-col items-center justify-start gap-2 group">
      <div className="relative w-[100%] aspect-[16/9]">
        <div className="">
          {videoId ? (
            <iframe
              width="100%"
              className="aspect-[16/9]"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>  
          ) : (
            <p>Invalid video URL</p>
          )}
        </div>
      </div>
      <p className="text-start text-xs sm:text-sm md:text-base font-semibold">
        {video.title}
      </p>
      {video.tags && (
        <div className="sr-only flex flex-wrap gap-1">
          {video.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs sm:text-sm lg:text-base font-medium text-surface-700 bg-primary-400 bg-opacity-15 rounded-lg px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
