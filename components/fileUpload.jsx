"use client";

import { Image } from "lucide-react";
import { useState } from "react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(50);

  const handleClear = () => {
    setSelectedFile(null);
  };

  return (
    <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
      <div className="md:flex">
        <div className="w-full p-3">
          <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="absolute flex flex-col items-center">
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  className="h-28 w-auto object-cover rounded-lg"
                  alt="Selected file"
                />
              ) : (
                <Image className="h-12 w-12" />
              )}
              <span className="block text-gray-500 font-semibold">
                Drag &amp; drop your files here
              </span>
              <span className="block text-gray-400 font-normal mt-1">
                or click to upload
              </span>
            </div>
            <input
              name=""
              className="h-full w-full opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>
          <div className="flex flex-row justify-between">
            <button onClick={handleClear}>Clear</button>
            <p>
              {selectedFile && (
                <>
                  File Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} Mb
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
