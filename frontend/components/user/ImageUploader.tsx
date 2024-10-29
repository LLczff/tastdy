"use client";
// This component only used in UserImageModal for cleaner code

import { useState, useRef } from "react";
import Image from "next/image";
// Type
import { FormDataFields } from "@/types";
// Icon
import { MdCloudUpload } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

const ImageUploader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null); // this value only used for display image

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = event.target.files;
    if (!uploaded) {
      return;
    }

    setImage(uploaded[0]); // this only use for display image
  };

  const handleImageRemove = () => {
    // remove displayed image
    setImage(null);
    // remove image from input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        name={FormDataFields.Image}
        id={FormDataFields.Image}
        hidden
        onChange={handleUpload}
      />
      {image ? (
        <div className="image-box mb-4">
          <button
            type="button"
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-400 z-10"
            onClick={handleImageRemove}
          >
            <IoCloseOutline
              className="text-white mx-auto align-middle"
              size={20}
            />
          </button>
          {image && (
            <Image
              src={URL.createObjectURL(image)}
              fill
              alt="uploaded-image"
              className="object-contain"
            />
          )}
        </div>
      ) : (
        <label
          htmlFor="user-image"
          className="image-box flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 mb-4"
        >
          <MdCloudUpload className="text-6xl" />
          <p className="font-medium text-xl">Upload your image</p>
        </label>
      )}
    </>
  );
};

export default ImageUploader;
