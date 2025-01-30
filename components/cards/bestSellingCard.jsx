import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BestSellingCard({ images }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handlePrev}
          className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handleNext}
          className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
        >
          <ChevronRight size={32} className="text-gray-600" />
        </button>
      </div>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings} className="px-10">
        {images.map((image, index) => (
          <div key={index} className="p-4 capitalize relative">
            <Link
              href={`/images/${image.image._id}`}
            >
              <Image
                width={800}
                height={800}
                src={image.image.imageLinks.thumbnail}
                alt={image.image.title}
                className="object-cover w-full aspect-[1/1] rounded-lg"
              />
            </Link>
            <p className="absolute top-10 left-10 bg-white bg-opacity-70 px-2 py-1 rounded-md">
              {image.downloadCount || 0} Downloads
            </p>
            <div className="text-neutral-600 mt-2">
              <h2 className="font-bold text-lg">{image.image.title}</h2>
              <Link href={`/photographer/${image.photographerDetails?._id}`} className="text-sm">
                {image.photographerDetails?.firstName}{" "}
                {image.photographerDetails?.lastName}
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
