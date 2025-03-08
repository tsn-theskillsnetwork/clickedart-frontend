"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GoogleReviewCard from "../cards/googleReview";
import TestimonialCard from "../cards/testimonialCard";
import Loader from "../loader";
import useLayoutStore from "@/store/layout";

export default function GoogleReviews() {
  const { layout } = useLayoutStore();
  const sliderRef = React.useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: false,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
    afterChange: (current) => {
      if (current === combinedReviews.length - settings.slidesToShow) {
        setTimeout(() => sliderRef.current?.slickGoTo(0), 3000);
      }
    },
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`
          ${process.env.NEXT_PUBLIC_SERVER}/api/layout/get-google-reviews`);
        const fiveStarReviews = response.data.data.result.reviews.filter(
          (review) => review.rating === 5
        );
        setReviews(fiveStarReviews);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) {
    return null;
  }
  const combinedReviews = [...reviews, ...(layout?.testimonials || [])];

  return (
    <div className="flex flex-col items-center space-y-10">
      {/* Slider Section */}
      <div className="w-full relative">
        <Slider ref={sliderRef} {...settings} className="!h-full">
          {combinedReviews.map((review, index) => {
            return (
              <div key={index} className="p-6">
                {review.profile_photo_url ? (
                  <GoogleReviewCard
                    avatar={review.profile_photo_url}
                    name={review.author_name}
                    rating={review.rating}
                    comment={review.text}
                  />
                ) : (
                  <TestimonialCard
                    avatar={review.image}
                    name={review.name}
                    stars={review.stars}
                    comment={review.message}
                  />
                )}
              </div>
            );
          })}
        </Slider>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={handlePrev}
            className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
          >
            <p className="sr-only">Previous Testimonial</p>
            <ChevronLeft size={32} className="text-gray-600" />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={handleNext}
            className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
          >
            <p className="sr-only">Next Testimonial</p>
            <ChevronRight size={32} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
