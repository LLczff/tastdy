"use client";

import { useState, useContext } from "react";
import { NextPage } from "next";
// Type
import { PostFields, PostUpdateType } from "@/types/post";
// Component
import { EditorContext } from "@/components/post/PostEditor";
// Utility
import { truncateString } from "@/utils";
// Icon
import { HiPlus } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";

const MAX_INGREDIENT_NAME_SHOWED = 20;

// Props is based on input, so we declare in the component
type EditorProps = {
  ingredients: string[];
};

const IngredientList: NextPage<EditorProps> = (state) => {
  const dispatch = useContext(EditorContext);
  const [input, setInput] = useState<string>("");

  const addTag = (event: React.KeyboardEvent) => {
    event.preventDefault();
    if (input.trim() && !state.ingredients.includes(input.trim())) {
      dispatch({
        type: PostUpdateType.INGREDIENT,
        payload: [...state.ingredients, input.trim()],
      });
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    dispatch({
      type: PostUpdateType.INGREDIENT,
      payload: state.ingredients.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <p className="font-medium mb-2">Ingredients</p>
      <div className="flex flex-wrap gap-1">
        {state.ingredients.map((ingredient, idx) => (
          <div
            key={idx}
            className="flex items-center rounded-sm px-2 py-1 bg-gray-100"
          >
            <span className="text-wrap">
              {truncateString(ingredient, MAX_INGREDIENT_NAME_SHOWED)}&nbsp;
            </span>
            <button type="button" onClick={() => removeTag(idx)}>
              <IoCloseOutline size={20} />
            </button>
          </div>
        ))}
        {/* width coming from placeholder + plus icon */}
        <label
          htmlFor={PostFields.Ingredients}
          className="relative w-28 rounded-sm"
        >
          <input
            type="text"
            id={PostFields.Ingredients}
            name={PostFields.Ingredients}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag(e)}
            className="peer w-full px-2 py-1 border border-dashed rounded-sm outline-none focus:border-secondary
                transition-all duration-200 placeholder:p-4 placeholder:font-light placeholder:text-zinc-300"
            placeholder="ingredient"
          />
          <HiPlus className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300 peer-[:not(:placeholder-shown)]:hidden" />
        </label>
      </div>
    </div>
  );
};

export default IngredientList;
