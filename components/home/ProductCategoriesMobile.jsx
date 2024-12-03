"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductCategoriesMobile() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center mb-20">
      <h1 className="font-bold text-heading-04 md:text-heading-02 lg:text-heading-01 text-accent-400 mb-10">
        Product Categories
      </h1>
      <div className="grid grid-cols-2 gap-4 justify-center">
        {/* card 1 */}
        <div
          className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
          onClick={() => {
            router.push("/search?theme=wildlife");
          }}
        >
          <Image
            width={300}
            height={300}
            src="https://s3-alpha-sig.figma.com/img/218b/bb78/ad6193d5132b5c1eed30c34cec5c93cb?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SCXAI5FmESc-vCSPJmGlFXwb3uw19m-qMjIzr9~30lGxPO7Dn4z4lLjxCVrnbk71B69UYuv29uNQAyZBXeDe1O4dSHAl8u9GxCABXpes0hAvr1Oac26VZnBWNp~8H14yNAilQ6pNBkbY1Xy8ZEKqH~6ZPwArUO7cty0I6~JrY5OWbcKCx~lri1kKPdn3gVK-n5QgdU6VR2Q0jaN43fHpFB0aORCz6xrnnlBKjwO9vmswSvIHwCEDG1XpambN1JFuFhj6bh7j6sLmFjap1xg5wJZZGrWtvF1BPx~21xc0KTv2PFKus9Hf1u2kAnZ~G2NazHgDtxkpBHqE5Qa8yNW3IA__"
            alt="wildlife"
            className={`object-cover rounded-2xl h-full w-full`}
          />
          <div className="absolute inset-x-0 bottom-0">
            <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
              WILDLIFE
            </h1>
          </div>
        </div>

        {/* card 2 */}
        <div
          className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
          onClick={() => {
            router.push("/search?theme=religious");
          }}
        >
          <Image
            width={300}
            height={300}
            src="https://s3-alpha-sig.figma.com/img/763d/9c68/a22f9c47717b508519cdcf0c925ea334?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HqknkT1mwyvg6DqHZFfzbY0MCYD7D9SUO30r-C77T1jo2NzTvtdvigy~2fV~VFEYSdjFznykp0jJWnFPJmhl6M6APuATc75uhb2K71zdxjsO4UqZTES1ZfKWGBZQHjFTj~jpkea-fFPafLVt1rCOytreELGBuEjqIBf14rkDN98L-ULHAkih0nt-hLhH6mATCXedddqtc1JCZKGTZXeN8TE9wMlMKh78cq7iLhr1FsP4KLolEuiMldFQNJ7hd~tehmisk7UT-6ixvbyJuAGn--ghfXP-uQzuD0zSJx5bP4zgwE3riGZVP5mdINXoC0vL-4FijR6VAWwBs7MyK3vaMA__"
            alt="religious"
            className={`object-cover rounded-2xl h-full w-full`}
          />
          <div className="absolute inset-x-0 bottom-0">
            <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
              RELIGIOUS
            </h1>
          </div>
        </div>

        {/* card 3 */}
        <div
          className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
          onClick={() => {
            router.push("/search?theme=portrait");
          }}
        >
          <Image
            width={300}
            height={300}
            src="https://s3-alpha-sig.figma.com/img/ec73/8d7c/510e39a2d9795c6b52180745db2b6f62?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oft3xwv-RHwtdP06Ntqr~KQv75aHm7Vy0tNuxINzR5JbbdqPN9hvhPFShsz5i7sXziFuROsyYZVoSLNgxn3Dwk-qQQ~Kagm053k5wwzR6Sw9QOLsh9GQVZ--ugjNKlhkEezClP58GUvtdbdcr8Tmd9Scl-l~LD-VuenBmuBmrhOIFia~mSwmu3iJb9bGCXt6x75LnUSzpSYDuEUZ0nc44MnmQFRSyjULnEXcp7XfTObTa3PNcr40XP-ZD1Cg73Gk~-xSz-FIOBLdGUnFgLByy~I1SZ6HXkIJmWSWrhrdI~TFIE5nvxeCfdOcK9dfItpPfFdKsEPkvnTlUnkqOAKDTw__"
            alt="portrait"
            className={`object-cover rounded-2xl h-full w-full`}
          />
          <div className="absolute inset-x-0 bottom-0">
            <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
              PORTRAIT
            </h1>
          </div>
        </div>

        {/* card 4 */}
        <div
          className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
          onClick={() => {
            router.push("/search?theme=nature");
          }}
        >
          <Image
            width={300}
            height={300}
            src="https://s3-alpha-sig.figma.com/img/5c7c/c283/8377c2901c7e37f906cbc6d86b14813e?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XxX104LpPAW-F6mN1sDBBfm4urHQsQaGYTZInYnJot17fTULe2rV5c4pMdx-jhuhS0P3vxhU43B1FSqpcYlwgGf1jJsm1e1sBIEDyhbNVtk5jcLJV4f8dlILq5040vyQ9-Bs2WoBMezAUESNTFXnRX0-toH1LjcBwQ2TP28cYgdZplKswSQiOtfvVt8cWT5qXZc-sqjHPp8aLp4LWSsJvKfh0Q9FnK3Iuq-~xdCxt6c3Ufyc~9xpdtkBuMHVTZikJ~4UjoyuNtolF72ZcaCX5wnh3Ygzx9rn0nkq9HK2OXDk8PN3q33e2JHNvivuaojU-r2B5l~BZW4Rhe5DTt8dVQ__"
            alt="nature"
            className={`object-cover rounded-2xl h-full w-full`}
          />
          <div className="absolute inset-x-0 bottom-0">
            <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
              NATURE
            </h1>
          </div>
        </div>

        {/* card 5 */}
        <div
          className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
          onClick={() => {
            router.push("/search?theme=landscape");
          }}
        >
          <Image
            width={300}
            height={300}
            src="https://s3-alpha-sig.figma.com/img/627b/0b6d/20a3bf4dde77d7b1dc1c7d9f234ce523?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P1P4CGFUcqeUAwJ8ukcMs0CNdoDzCmpslbhU~4eNAiHr0sliOUzk5IXv5tjDXGs5ZrYb7PxsmeQDqWqC~ZSg4t0XAU6wBuwFGIS9X513iWiiuR3doAoDnimLrDT0WUcrDiemoZ~Oe3qUOfx2pQeFzietDvf6a-uWYRfekdZFBPjhqiJRa3tDDotfq3v7DvSRE4lUEDSH~rxZlB68mRJJp9XTFtLcx3d~HsKcJMHiP2lE5x-ztoErFyYPtLa6SqkJ07vU6BAztBLtC9Ix7GM1qoPntgBYgc3Xc1y86pEUGZTsal0wOjqPyxWcxWKr8q2374S7tKk~zm3Pl~v5MworZA__"
            alt="landscape"
            className={`object-cover rounded-2xl h-full w-full`}
          />
          <div className="absolute inset-x-0 bottom-0">
            <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
              LANDSCAPE
            </h1>
          </div>
        </div>

        {/* card 6 */}
        <div
          className={`relative shadow-md shadow-zinc-400 rounded-2xl`}
          onClick={() => {
            router.push("/search?theme=grayscale");
          }}
        >
          <Image
            width={300}
            height={300}
            src="https://s3-alpha-sig.figma.com/img/39cb/8625/49a35245701429e2956896618cdd1780?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BrrNQr4Cb08rywYpHGRXO8oE93UPsRMGkyKoIS0QiZTFdus7BxITXLM9vFLyvwv8JzAzKQr6CDV2do9qN1gAbPjsA5~VXbaXioIjhtzs8GIeIz5S~Y8gGnSP3CeADOi~PvXWbJ1N5YANdS2JFaR88nvHc2OMWUF8iOROdkUNVJTuJkIFhFX0HYf~Vg9sdfds1hryjKtt5o-x-mFymxxqQjBWRr7c6srE~w381H375LxScP8BBLJcAnRRE4KnR8WljnydohJ3e1VUFBjT4CzqtI01JYSGvQpHtn4tjwSLzK78ty5HyshqA5dvngApKPr6hzpKjaf9BomJcGxKPzA8Cw__"
            alt="grayscale"
            className={`object-cover rounded-2xl h-full w-full`}
          />
          <div className="absolute inset-x-0 bottom-0">
            <h1 className="text-heading-05 font-bold drop-shadow-md text-center text-white">
              GRAYSCALE
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
