"use client";

import { NextPage } from "next";
import { useRef, useContext } from "react";
import Image from "next/image";
// Component
import { EditorContext } from "@/components/post/PostEditor";
// Type
import { PostUpdateType } from "@/types/post";
// Utility
import { imageToBase64, truncateString } from "@/utils";
// Icon
import { MdCloudUpload } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

const MAX_IMAGE_NAME_SHOWED = 20;

// Props is based on input, so we declare in the component
type EditorProps = {
  image: string;
  imageName: string;
};

const ImageUploader: NextPage<EditorProps> = (state) => {
  const dispatch = useContext(EditorContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploaded = event.target.files;
    if (!uploaded) {
      return;
    }
    const image = uploaded[0];
    const base64 = await imageToBase64(image);
    dispatch({ type: PostUpdateType.IMAGE, payload: base64 });
    dispatch({ type: PostUpdateType.IMAGE_NAME, payload: image.name });
  };

  const handleImageRemove = () => {
    dispatch({ type: PostUpdateType.IMAGE, payload: "" });
    dispatch({ type: PostUpdateType.IMAGE_NAME, payload: "" });

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        name="user-image"
        id="user-image"
        hidden
        onChange={handleImageUpload}
      />
      {/* this work for empty string as well */}
      {state.image ? (
        <div className="image-box">
          <Image
            src={state.image}
            fill
            alt="uploaded-image"
            className="object-cover"
          />
        </div>
      ) : (
        <label
          htmlFor="user-image"
          className="image-box flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100"
        >
          <MdCloudUpload className="text-6xl" />
          <p className="font-medium text-xl">Upload your image</p>
        </label>
      )}
      {state.imageName && (
        <p className="flex items-center justify-between bg-red-400 text-white px-1 py-1 text-sm rounded-sm">
          {truncateString(state.imageName, MAX_IMAGE_NAME_SHOWED)}
          <IoCloseOutline
            className="cursor-pointer"
            size={20}
            onClick={handleImageRemove}
          />
        </p>
      )}
    </>
  );
};

export default ImageUploader;
