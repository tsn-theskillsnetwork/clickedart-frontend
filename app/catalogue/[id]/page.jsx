"use client";

import axios from "axios";
import Link from "next/link";
import React, {  useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function CataloguesPage() {
  const id = useParams().id;
  const [catalogue, setCatalogue] = useState([]);

  const fetchCatalogue = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/catalogue/get-catalogue-by-id?catalogueId=${id}`
      );
      console.log(res.data.catalogue);
      setCatalogue(res.data.catalogue);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 gap-5 py-10">
      {!catalogue && (
        <div>
          <p className="text-heading-06 font-semibold">No Catalogues Found</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-heading-03 font-semibold">{catalogue.name}</p>
          <p className="text-base -mt-1">{catalogue.description}</p>
          <p className="text-base font-semibold">
            By:{" "}
            {catalogue.photographer?.firstName
              ? catalogue.photographer?.firstName +
                " " +
                catalogue.photographer?.lastName
              : catalogue.photographer?.name}
          </p>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {catalogue.images?.map((image, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Link
              href={`/images/${image._id}`}
              className="relative group shadow-[2px_2px_6px_rgba(0,0,0,0.4)]"
            >
              <Image
                width={800}
                height={800}
                priority
                src={
                  image.imageLinks.thumbnail ||
                  image.imageLinks.small ||
                  image.imageLinks.medium ||
                  image.imageLinks.original
                }
                alt={image.description}
                className="object-cover w-full aspect-[1/1] transition-all duration-200 ease-linear"
              />
              <div className="text-white absolute bottom-0 p-4 pt-6 bg-gradient-to-t from-black to-transparent inset-x-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-linear">
                <h2 className="text-heading-06 font-semibold">
                  {image.title || "Untitled"}
                </h2>
                <p className="font-medium text-surface-200">
                  {image.category?.map((category) => category.name).join(", ")}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
