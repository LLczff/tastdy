"use client";

import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
// Type
import { RecipePost, ErrorMessage, Tag } from "@/types";
// Utility
import UtilityHook from "@/components/UtilityHook";
import { kNumber, formatTimeAgo } from "@/utils";
// Server
import { likeRecipe, revalidateTagClient } from "@/app/actions";
// Constant
import { CATEGORIES_FILTER } from "@/constants";
// Icon
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { TfiClose } from "react-icons/tfi";

const PostModal: NextPage<RecipePost> = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openLoginModal, closeModal } = UtilityHook();

  // DOM cannot be access via SSR
  // we need to make this as client component and use useEffect hook
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
    if (pathname === "/recipe") {
      // this component can be opened in multiple path
      // but if it "/recipe" this tag will be needed to revalidate
      await revalidateTagClient(Tag.Recipes);
    }

    // this tag absolutely need to revalidate
    await revalidateTagClient(Tag.SingleRecipe);
  };

  const navigateToUser = () => {
    closeModal("post"); // refresh from this function is useless in this situation
    router.push(`/user/@${props.author._id}`);
    router.refresh(); // this is necessary for closing post modal
  };

  return (
    <div className="modal-bg py-10">
      <section
        className="relative bg-slate-50 rounded-sm w-full h-full max-h-fit overflow-x-scroll max-w-lg 
        md:max-w-3xl md:overflow-x-auto lg:max-w-5xl transition-all"
      >
        <div className="sticky z-10 bg-inherit top-0 flex px-2 py-1 items-center justify-between rounded-t-sm md:border-b md:border-b-stone-300">
          <button className="flex items-center gap-2" onClick={navigateToUser}>
            <figure className="relative w-9 h-9">
              <Image
                src={props.author.image || "/fallback_profile.png"}
                fill
                sizes="100%"
                alt="user-icon"
                className="aspect-square rounded-full cursor-pointer object-cover"
              />
            </figure>
            <p className="font-semibold">{props.author.username}</p>
          </button>
          <button className="text-zinc-500" onClick={() => closeModal("post")}>
            <TfiClose size={28} />
          </button>
        </div>
        {/* Height of modal after screen width 768px related to this div */}
        <div className="flex flex-col md:flex-row md:h-[480px]">
          <figure className="relative w-full h-96 md:h-full">
            <Image
              src={props.image}
              alt={props.dish + "_" + props.author}
              fill
              priority
              sizes="100%"
              className="object-cover"
            />
          </figure>
          <article className="flex flex-col gap-5 px-2 pt-3 pb-3 w-full md:overflow-scroll md:px-5 md:pt-2">
            <div>
              <h2 className="font-bodoni-moda text-2xl font-semibold text-primary">
                {props.dish}
              </h2>
              <h3>
                <button
                  type="button"
                  onClick={handleLike}
                  className={`hover:scale-110 active:scale-100 ${
                    props.liked ? "text-red-500" : "text-neutral-400"
                  }`}
                >
                  {props.liked ? (
                    <IoHeartSharp className="inline-block" size={24} />
                  ) : (
                    <IoHeartOutline className="inline-block" size={24} />
                  )}
                </button>
                <span className="text-sm text-zinc-600">
                  &nbsp;{kNumber(props.favorite)} liked
                </span>
                <span className="text-zinc-500 font-thin text-xl">
                  &nbsp;|&nbsp;
                </span>

                <span className="text-sm text-zinc-600 font-light">
                  {
                    CATEGORIES_FILTER.find(
                      (item) => item.value === props.category
                    )?.label
                  }
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-extralight leading-7">
                {formatTimeAgo(new Date(props.createdAt))}
              </p>
            </div>
            <ul>
              <h4 className="font-semibold underline">Ingredients</h4>
              {props.ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  <span className="align-middle">&bull;</span>
                  &nbsp;{ingredient}
                </li>
              ))}
            </ul>
            <ol>
              <h4 className="font-semibold underline">Methods</h4>
              {props.procedures.map((procedure, idx) => (
                <li key={idx}>
                  <span className="font-light text-secondary">{idx + 1}.</span>
                  &nbsp;{procedure}
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PostModal;
