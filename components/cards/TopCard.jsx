import { HeartIcon } from "lucide-react";
import React from "react";

export default function TopCard({ image, title, photographer }) {
  const [liked, setLiked] = React.useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 rounded-lg border-black h-40 w-60 flex items-center justify-center shadow-lg bg-slate-100 hover:bg-white transition-all duration-200 ease-out">
        <img className="h-36 w-auto object-contain" src={image} alt={title} />
      </div>
      <div className="flex flex-row mt-2 max-w-1/2">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="font-semibold">{photographer}</p>
        </div>
      </div>
      <div className="relative bottom-[30%] left-[43%]">
        <button onClick={handleLike}>
          <HeartIcon
            className={`${
              liked ? "fill-red-500 hover:fill-red-600 hover:text-red-600" : "fill-white hover:fill-red-300 hover:text-red-300"
            } text-red-500 active:scale-90 transition-all duration-100 ease-out`}
          />
        </button>
      </div>
    </div>
  );
}
