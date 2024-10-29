"use client";

import { NextPage } from "next";
import Image from "next/image";
// Type
import { PostState } from "@/types/post";
// Constant
import { CATEGORIES_FILTER } from "@/constants";

const PostReview: NextPage<PostState> = (props) => {
  return (
    <div className="flex flex-col md:flex-row md:h-[480px]">
      <figure className="relative w-full h-96 md:h-full">
        <Image
          src={props.image}
          alt={props.imageName}
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
          <h3 className="text-sm text-zinc-600 font-light">
            {
              CATEGORIES_FILTER.find((item) => item.value === props.category)
                ?.label
            }
          </h3>
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
  );
};

export default PostReview;
