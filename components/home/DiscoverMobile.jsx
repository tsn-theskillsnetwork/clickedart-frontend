"use client";
import React from "react";
import Button from "../Button";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const images = [
  {
    src: "https://s3-alpha-sig.figma.com/img/1443/b3f3/ac03a432ad009dd8d20d6319d4d8332f?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Br2w5CRq5KAy5yjkve6rwfwthQgdvnKf2pig2CjU5lpdlAnL7VIl7zzNH257pWFP2Xtmj35D5N1oI2yMDR6RYUM7LCw2lnO7HH3KGbozX9Z2iPgj5JjtAmaKRKYUXGcd2F4b~YYoofZoG5vvLxXTTfji~bDO7aA79-XyifIocfwfjyXQpXTA~h271xOIBXaxTnr8W-ucW3PRV8HmZxMMH1wFPsYWQfvBd5HYoPKHiuAKTMpahtsv8Alekh-aoIKMBo6QIOH7dI0I-R3~RxF19Zj-Sa2HX1lWLAYmI6muEcn1YhmzyPUOiAXYv-up42BaUlDmlDetXS1cDCChOvZG6A__",
    title: "Artwork 1",
    artist: "Photographer",
  },
  {
    src: "https://s3-alpha-sig.figma.com/img/4d19/b23e/3d228a3fd195bfa60377fd55d160a5b1?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RJleyEbrM8Siv1irCjW28y86eWG8YfloSsB65haSB6pu-SZvxFugBo9IiETrUWj0eDx2Uv2x8z~C4ZTuoAEGSrme1WpWEqgpNW1qejQuAle5yT~Sfu9FW6lb0pkfkass44lHqmhHH12A9tr6zyPseACmzQdoONijSubghjUmFeZx4kgsXOSqt9ttfgdY8AAcSCRZIzRIN4I4ImVNbrinSrVlTRN3Um-NHa5yabAutJVpUyM2PRmrUb2pwGCjoetmKh9SLzxAnAUWzrcRFO2NtZ80gkR6UNXONVLXOuEhpwVin9n29EcbGn92XMHi3PSHW-w8R7QYc2YialXiEq~IQQ__",
    title: "Artwork 2",
    artist: "Photographer",
  },
  {
    src: "https://s3-alpha-sig.figma.com/img/e541/6040/dd804d614c4ef6952edb34d3b67bb876?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IheQoYIlVLhA49cON-I3ottLvdHSP0odKYq6BFDxmiLERYUuJk30Wm5Ov6NYO~r1-dKRCi7nmFU4WMQYJshAWqQjtksIPsLhMahZyPVRJazie-EbpT6qwsuF0NA8QETcSQybD8gaLRP6SNiPwOkkJUt-Cwg9Vy1MY9V9HvGR3Ppu4DJeDd75SzGWs5MWktwYubB5agLLTOod~0NeZKy0RpQOzq63X5dBktpBl27SJjbe0VpIY2Y6g-fyG-ZWRTlKcrGjZt2D9X8yOoEDIfKMXhlotR6pKPLn3cBtBClfWWJJp~hX84dHvZ7OUDy-YA1zwjyrbkb7JiPSIV-9Ew6ZcA__",
    title: "Artwork 3",
    artist: "Photographer",
  },
  {
    src: "https://s3-alpha-sig.figma.com/img/cac9/a26e/7da08258b5c86643ba5152c9ef5813c2?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=V~~ZFGe80QQn6KzX46-Tkd2G1pZ7vUgaWWyJj00ZrtrNCm2wJXZcayA2vDyMoWStijiRVwdppJO8Gcl73Q36GBee2VXaOEIGqPpQreo34tpncy-iZO2uFYmjgDVE2nbn9IUYBIveIZbgsq380QK9zdWRstOgMMob4ilmWUmlxDx6QE1mRjDrV5NN~gX~i9PYu4jXKts4xJa5oMYrEFCqyLdsb6HzbwOSRt71KrP289MOn4fB1aOP2lSyZaPamVkY7WKGr41Fly8NlnBOvvpluZ60~2PX1OQEj9pwBp9Yp4IsMlE7kdGEhillYAAOX1zIYBNDRFrEMRWkP38UmdQcvQ__",
    title: "Artwork 4",
    artist: "Photographer",
  },
  {
    src: "https://s3-alpha-sig.figma.com/img/a081/99fd/ce80a405fc7004863005e9e7075b6ad3?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=T-MYyUeVxKCw8x5eciw8URuBBj1wQ5Ubl7Od2FteOQpFtfz6FB3lMtvS40AnmsqzlzTjCBvBM~9ZSzpNF0bQBQV6w9bOkn1Ta8TKVwGlMYv6EitR7ldqBhPWerMyzYKR36gNL5jFoYRbp0rIYcea7BCVzn1gHo7GLNujWXhMthp6rKM8E35jvZzY-6APPIvfbjaiD8HnufPRgt1ixDbGPjEKzEst6djEESqARO43~wPqpyygyvXqbDqi98y6lE9GiONt6TJ1H~cDND-vBZaqZ7FigamgpLNPuJiA2sY4KLI-TM2ZEpkkH3ZXWhPSR9TJIhDN8UcOaKU18HzJpPdZqQ__",
    title: "Artwork 5",
    artist: "Photographer",
  },
];

export default function DiscoverMobile() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col text-center items-center justify-center gap-8 mb-10">
        <h1 className="font-bold text-heading-05 sm:text-heading-03 md:text-heading-02 text-accent-400">
          Every Photo Tells a Story—Discover It
        </h1>
        <Button
          size="lg"
          variant="filled"
          state="default"
          onClick={() => {
            toast.success("Explore More");
          }}
        >
          Explore More
        </Button>
      </div>
      <div className="flex flex-col">
        {images.map((image, index) => (
          <div key={index} className="my-0 py-0">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative group overflow-hidden"
            >
              <Image
                width={300}
                height={200}
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 p-4 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <h2 className="font-bold text-heading-06 sm:text-heading-06 md:text-heading-06 text-white">
                  {image.title}
                </h2>
                <p className="text-paragraph text-white">{image.artist}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
