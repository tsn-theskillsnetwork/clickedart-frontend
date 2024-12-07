"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ImagePage() {
  const id = useParams().id;

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-image-by-id?id=${id}`,
        {
          method: "GET",
        }
      );
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch image");

      const data = await response.json();
      console.log(data);
      setImage(data.image);
    } catch (error) {
      console.error("Error fetching image data", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-[80vh]">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {image && (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <img src={image.url} alt={image.title} />
              <p>{image.title}</p>
            </div>
          )}
        </>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p>Error fetching image data</p>
        </div>
      )}
    </div>
  );
}
