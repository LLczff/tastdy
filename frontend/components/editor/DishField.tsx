"use client";

import { useContext } from "react";
import { NextPage } from "next";
// Type
import { PostFields, PostUpdateType } from "@/types/post";
// Component
import { EditorContext } from "@/components/post/PostEditor";

// Props is based on input, so we declare in the component
type EditorProps = {
  dish: string;
};

const DishField: NextPage<EditorProps> = (state) => {
  const dispatch = useContext(EditorContext);

  return (
    <div>
      <label htmlFor={PostFields.Dish} className="font-medium">
        Dish name
      </label>
      <input
        type="text"
        id={PostFields.Dish}
        name={PostFields.Dish}
        value={state.dish}
        placeholder="What should we call this menu?"
        className="w-full px-2 py-1 rounded-sm border outline-none 
                placeholder:font-light placeholder:text-zinc-300"
        onChange={(e) =>
          dispatch({
            type: PostUpdateType.DISH,
            payload: e.target.value,
          })
        }
      />
    </div>
  );
};

export default DishField;
