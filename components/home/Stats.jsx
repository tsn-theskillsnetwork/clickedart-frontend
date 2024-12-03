"use client";

import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Stats() {
  return (
    <div>
      <div className=" relative bg-cover bg-[center_-4rem] ">
        <Image
          width={1600}
          height={900}
          src="/assets/Strathmore Clean White 300gsm.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover -z-50 opacity-90 xl:object-[center_-10rem]"
        />
        <div className="h-full bg-white bg-opacity-15 py-10 md:py-10">
          <div className="px-5 sm:px-36 lg:w-1/2 w-full">
            <h1 className="text-heading-05 sm:text-heading-03 md:text-heading-02 font-bold text-white">
              TITLE
            </h1>
            <div className="md:w-5/6 md:mt-4">
              <p className="text-white text-sm sm:text-md md:text-base">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
                excepturi quibusdam vitae? Suscipit, vel. Fugit quas aut illum
                harum, praesentium beatae mollitia iusto et officia ipsum
                aperiam non ratione deserunt?
              </p>
            </div>
            <div className="flex flex-row gap-2 mt-2 md:mt-10">
              <div className="flex flex-row">
                <Image
                  width={50}
                  height={50}
                  className="border-2 border-white rounded-full w-8 h-8 object-cover object-top"
                  src="https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__"
                  alt="avatar"
                />
                <Image
                  width={50}
                  height={50}
                  className="border-2 border-white rounded-full w-8 h-8 object-cover object-top -ml-1"
                  src="https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__"
                  alt="avatar"
                />
                <Image
                  width={50}
                  height={50}
                  className="border-2 border-white rounded-full w-8 h-8 object-cover object-top -ml-1"
                  src="https://s3-alpha-sig.figma.com/img/0d63/5630/71ee0be67a603e99a26544662f2b5442?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QejvFO1QVwt~7-6qbzMow1~RNgtZbvnMucqgVqh2Hww6dS~TlxvgQ~Qn9D7rGeJ9lQoWCgZd1BzKf01BLGOfmLmD4zt4dRisxvVIuBbqklQ0P1q611aS~t5rUItnFvQe8mljNNXTpuj0dK~Ce5rM2Pd-Dag9PkqxksxB6qK9c02aVMrQQ24Mg9l8VWx2sHitjQ-PfHGLiEBrTfe6mfzE41mG2RfAR5erp4fGvN7o8xGpT5XDSCWiK9Efv4OwfFPgd1fxo4fhIDQqm7U1eppDgbLbB40L3Z3M3F7RPYj1EFKVwRiYhGFqaQQm~x0uoYP4oY0boD3TcWjKkwhz5pjBEQ__"
                  alt="avatar"
                />
              </div>
              <div className="text-white">
                <p className="text-md sm:text-paragraph">
                  {
                    <CountUp
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                      end={100}
                      suffix="K+"
                      duration={5}
                    />
                  }
                </p>
                <p className="text-sm sm:text-md">Happy Clients</p>
              </div>
            </div>
          </div>
          <div className="mt-5 md:mt-16 flex flex-row md:py-8 px-5 md:px-20 text-white w-full md:w-8/12 backdrop-blur-md md:rounded-3xl justify-around mx-auto">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-heading-06 md:text-heading-03">
                {
                  <CountUp
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                    end={2000}
                    suffix="+"
                    duration={5}
                  />
                }
              </h2>
              <p className="text-xs md:text-md text-center">Downloads</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-heading-06 md:text-heading-03">
                {
                  <CountUp
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                    end={1}
                    suffix="M+"
                    duration={5}
                  />
                }
              </h2>
              <p className="text-xs md:text-md text-center">
                Products Available
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-heading-06 md:text-heading-03">
                {
                  <CountUp
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                    end={800}
                    duration={5}
                  />
                }
              </h2>
              <p className="text-xs md:text-md text-center">
                upto 800 Megapixel resolution
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-heading-06 md:text-heading-03">
                {
                  <CountUp
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                    end={24}
                    suffix="/"
                    duration={5}
                  />
                }
                {
                  <CountUp
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                    end={7}
                    duration={5}
                  />
                }
              </h2>
              <p className="text-xs md:text-md text-center">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
