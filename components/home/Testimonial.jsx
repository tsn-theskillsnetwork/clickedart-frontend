"use client";

import React from "react";
import TestimonialCard from "../cards/TestimonialCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft } from "lucide-react";

export default function Testimonial() {
  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 0,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 0 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 0 },
      },
    },
  });

  const handleNavigation = (direction) => {
    if (direction === "left") {
      slider.current?.prev();
    } else if (direction === "right") {
      slider.current?.next();
    }
  };

  const testimonials = [
    {
      avatar:
        "https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__",
      name: "John Doe",
      stars: 5,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo ut arcu semper venenatis. Nulla facilisi. Nulla facilisi. Nulla facilisi.",
    },
    {
      avatar:
        "https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__",
      name: "Jane Doe",
      stars: 4,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo ut arcu semper venenatis. Nulla facilisi. Nulla facilisi. Nulla facilisi.",
    },
    {
      avatar:
        "https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__",
      name: "John Smith",
      stars: 5,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo ut arcu semper venenatis. Nulla facilisi. Nulla facilisi. Nulla facilisi.",
    },
    {
      avatar:
        "https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__",
      name: "Jane Smith",
      stars: 4,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo ut arcu semper venenatis. Nulla facilisi. Nulla facilisi. Nulla facilisi.",
    },
    {
      avatar:
        "https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__",
      name: "John Doe",
      stars: 4,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo ut arcu semper venenatis. Nulla facilisi. Nulla facilisi. Nulla facilisi.",
    },
  ];
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center justify-center text-center sm:w-1/2">
        <div className="text-heading-04 sm:text-heading-02 text-primary font-bold">
          Trusted by Our Community, Loved by You
        </div>
        <div className="text-heading-06 text-primary font-semibold">
          Discover why our community chooses us – real stories from people who
          trust and love our products
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider flex">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="keen-slider__slide p-6">
            <TestimonialCard
              avatar={testimonial.avatar}
              name={testimonial.name}
              stars={testimonial.stars}
              comment={testimonial.comment}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center gap-28 mt-10">
        <button
          className="bg-zinc-200 rounded-full"
          onClick={() => handleNavigation("left")}
        >
          <p className="sr-only">Testimonial Previous</p>
          <ChevronLeft
            className="text-zinc-500 pr-1 hover:text-white"
            size={64}
          />
        </button>
        <button
          className="bg-zinc-200 rounded-full"
          onClick={() => handleNavigation("right")}
        >
          <p className="sr-only">Testimonial Next</p>
          <ChevronLeft
            className="text-zinc-500 pr-1 hover:text-white transform rotate-180"
            size={64}
          />
        </button>
      </div>
    </div>
  );
}
