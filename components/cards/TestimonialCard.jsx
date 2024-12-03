import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function TestimonialCard({ avatar, name, stars, comment }) {
  return (
    <div className="flex flex-col px-10 py-5 bg-white shadow-lg shadow-zinc-300 rounded-3xl justify-center items-center gap-4 w-11/12">
      <div>
        <Image
          width={80}
          height={80}
          src={avatar}
          alt={name}
          className="rounded-full w-20 h-20 object-cover object-top border-2 border-white shadow-zinc-400 shadow-lg"
        />
      </div>
      <div className="">{comment}</div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row">
          {Array.from({ length: stars }).map((_, index) => (
            <Star className=" fill-yellow-300 text-yellow-300" key={index} />
          ))}
          {Array.from({ length: 5 - stars }).map((_, index) => (
            <Star className=" fill-yellow-100 text-yellow-100" key={index} />
          ))}
        </div>
        <div className="text-secondary-200 text-heading-06 font-semibold">
          {name}
        </div>
      </div>
    </div>
  );
}
