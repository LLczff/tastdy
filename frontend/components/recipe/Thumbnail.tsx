"use client";

import { useRef } from "react";
import { NextPage } from "next";
import Image from "next/image";
// Type
import { ErrorMessage, Menu, Tag } from "@/types";
// Server
import { likeRecipe, revalidateTagClient } from "@/app/actions";
// Utility
import UtilityHook from "@/components/UtilityHook";
// Icon
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const Thumbnail: NextPage<Menu> = (props) => {
  const { openLoginModal, openPostModal } = UtilityHook();
  const likeRef = useRef<HTMLButtonElement>(null);

  const handleLike = async () => {
    const resStatus = await likeRecipe(props._id);

    // If user not authenticated, open login modal
    if (resStatus === 401) {
      openLoginModal();
      return;
    }

    // other error, throw it
    if (resStatus !== 200) {
      throw new Error(ErrorMessage.ServerError);
    }

    // no error, revalidate tag
    // this tag absolutely need to revalidate
    await revalidateTagClient(Tag.Recipes);
  };

  const handleOpenPost = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    if (likeRef.current && !likeRef.current.contains(target)) {
      openPostModal(props._id);
    }
  };

  return (
    <div
      className="w-11/12 rounded-sm mx-auto bg-white cursor-pointer"
      onClick={(e) => handleOpenPost(e)}
    >
      <figure className="relative w-full aspect-4/3">
        <Image
          src={props.image}
          alt={props.dish + "_" + props.author}
          className="rounded-t-sm object-cover"
          fill
          sizes="100%, (min-width: 576px) 50%, (min-width: 1024px) 33.33%, (min-width: 1280px) 25%, (min-width: 1536px) 20%"
        />
        <button
          type="button"
          ref={likeRef}
          onClick={handleLike}
          className={`absolute top-2 right-2 text-[28px] hover:scale-110 active:scale-100 ${
            props.liked ? "text-red-500" : "text-neutral-50"
          }`}
        >
          {props.liked ? <IoHeartSharp /> : <IoHeartOutline />}
        </button>
      </figure>
      <div className="px-2.5 pt-2 pb-1.5">
        <h3 className="font-semibold font-bodoni-moda">{props.dish}</h3>
        <p className="text-sm text-slate-500 font-light ">{props.author}</p>
      </div>
    </div>
  );
};

export default Thumbnail;
