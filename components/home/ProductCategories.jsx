"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductCategories() {
  const router = useRouter();

  const [hovered1, sethovered1] = React.useState(false);
  const [hovered2, sethovered2] = React.useState(false);
  const [hovered3, sethovered3] = React.useState(false);
  const [hovered4, sethovered4] = React.useState(false);

  const handleHover1 = () => {
    sethovered1(true);
  };

  const handleHover2 = () => {
    sethovered2(true);
  };

  const handleHover3 = () => {
    sethovered3(true);
  };

  const handleHover4 = () => {
    sethovered4(true);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-0">
      <h1 className="font-bold text-heading-01 text-accent-400 mb-10">
        Themes
      </h1>
      <div className="flex mx-2 sm:mx-40 gap-2 sm:gap-4 justify-end">
        {/* card 1 */}
        <motion.div
          layout
          initial={{ width: "60%", aspectRatio: 2 / 1 }}
          animate={{
            width: hovered1 || hovered2 ? "30%" : "60%",
            aspectRatio: hovered1 || hovered2 ? 1 / 1 : 2 / 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`card1 relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer overflow-hidden`}
          onClick={() => {
            router.push("/images?theme=wildlife");
          }}
        >
          <div className="absolute bottom-2">
            <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
              WILDLIFE
            </h1>
          </div>
          <Image
            width={800}
            height={800}
            src="/assets/themes/wildlife.jpg"
            alt="wildlife"
            className={`img1 w-full h-full object-cover rounded-2xl`}
          />
        </motion.div>
        {/* card 2 */}
        <motion.div
          layout
          onHoverStart={handleHover1}
          onHoverEnd={() => {
            sethovered1(false);
          }}
          initial={{ width: "30%", aspectRatio: 1 / 1 }}
          animate={{
            width: hovered1 ? "60%" : "30%",
            aspectRatio: hovered1 ? 2 / 1 : 1 / 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`card2 relative flex flex-row aspect-[1/1] gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer`}
          onClick={() => {
            router.push("/images?theme=religious");
          }}
        >
          <div className={`absolute bottom-2`}>
            <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
              RELIGIOUS
            </h1>
          </div>
          <Image
            width={800}
            height={800}
            src="/assets/themes/religious.jpg"
            alt="religious"
            className={`img2 w-full h-full object-cover rounded-2xl`}
          />
        </motion.div>
        {/* card 3 */}
        <motion.div
          layout
          onHoverStart={handleHover2}
          onHoverEnd={() => {
            sethovered2(false);
          }}
          initial={{ width: "30%", aspectRatio: 1 / 1 }}
          animate={{
            width: hovered2 ? "60%" : "30%",
            aspectRatio: hovered2 ? 2 / 1 : 1 / 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`card3 relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer`}
          onClick={() => {
            router.push("/images?theme=portrait");
          }}
        >
          <div className={`absolute bottom-2`}>
            <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
              PORTRAIT
            </h1>
          </div>
          <Image
            width={800}
            height={800}
            src="/assets/themes/portrait.jpg"
            alt="wildlife"
            className={`img3 w-full h-full rounded-2xl object-cover`}
          />
        </motion.div>
      </div>
      <div className="flex mx-2 sm:mx-40 mt-2 sm:mt-5 gap-2 sm:gap-4 justify-end mb-16">
        {/* card 4 */}
        <motion.div
          onHoverStart={handleHover3}
          onHoverEnd={() => {
            sethovered3(false);
          }}
          layout
          initial={{ width: "30%", aspectRatio: 1 / 1 }}
          animate={{
            width: hovered3 ? "60%" : "30%",
            aspectRatio: hovered3 ? 2 / 1 : 1 / 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`card4 relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer`}
          onClick={() => {
            router.push("/images?theme=nature");
          }}
        >
          <div className="absolute bottom-2">
            <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
              NATURE
            </h1>
          </div>
          <Image
            width={800}
            height={800}
            src="/assets/themes/nature.jpg"
            alt="nature"
            className={`img4 w-full h-full rounded-2xl object-cover`}
          />
        </motion.div>
        {/* card 5 */}
        <motion.div
          layout
          initial={{ width: "60%", aspectRatio: 2 / 1 }}
          animate={{
            width: hovered3 || hovered4 ? "30%" : "60%",
            aspectRatio: hovered3 || hovered4 ? 1 / 1 : 2 / 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`card5 relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer`}
          onClick={() => {
            router.push("/images?theme=landscape");
          }}
        >
          <div className={`absolute bottom-2`}>
            <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md">
              LANDSCAPE
            </h1>
          </div>
          <Image
            width={800}
            height={800}
            src="/assets/themes/landscape.jpg"
            alt="landscape"
            className={`img5 w-full h-full rounded-2xl object-cover`}
          />
        </motion.div>
        {/* card 6 */}
        <motion.div
          layout
          onHoverStart={handleHover4}
          onHoverEnd={() => {
            sethovered4(false);
          }}
          initial={{ width: "30%", aspectRatio: 1 / 1 }}
          animate={{
            width: hovered4 ? "60%" : "30%",
            aspectRatio: hovered4 ? 2 / 1 : 1 / 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`card6 relative flex flex-row gap-4 shadow-xl shadow-zinc-300 rounded-2xl justify-center cursor-pointer`}
          onClick={() => {
            router.push("/images?theme=grayscale");
          }}
        >
          <div className={`absolute bottom-2`}>
            <h1 className="sm:text-heading-06 md:text-heading-05 lg:text-heading-04 xl:text-heading-03 font-bold text-white drop-shadow-md shadow-black">
              GRAYSCALE
            </h1>
          </div>
          <Image
            width={800}
            height={800}
            src="/assets/themes/grayscale.jpg"
            alt="grayscale"
            className={`img6 w-full h-full rounded-2xl object-cover`}
          />
        </motion.div>
      </div>
    </div>
  );
}
