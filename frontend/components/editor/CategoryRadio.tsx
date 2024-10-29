"use client";

import { NextPage } from "next";
import { useState, useContext } from "react";
// Type
import { Category, CategoryValue } from "@/types";
import { PostFields, PostUpdateType } from "@/types/post";
// Component
import { EditorContext } from "@/components/post/PostEditor";
// Constant
import { CATEGORIES_FILTER } from "@/constants";
// Icon
import { GiBowlOfRice, GiFrenchFries } from "react-icons/gi";
import { PiBowlSteamFill, PiAvocadoFill } from "react-icons/pi";
import { IoIosIceCream } from "react-icons/io";
import { FaWineGlassAlt } from "react-icons/fa";

// Props is based on input, so we declare in the component
type EditorProps = {
  category: CategoryValue;
};

const CATEGORY_BUTTON = [
  {
    label: "Main Dish",
    value: Category.MainDish,
    icon: <GiBowlOfRice />,
  },
  {
    label: "Soup",
    value: Category.Soup,
    icon: <PiBowlSteamFill />,
  },
  {
    label: "Dessert",
    value: Category.Dessert,
    icon: <IoIosIceCream />,
  },
  {
    label: "Salad",
    value: Category.Salad,
    icon: <PiAvocadoFill />,
  },
  {
    label: "Snack",
    value: Category.Snack,
    icon: <GiFrenchFries />,
  },
  {
    label: "Beverage",
    value: Category.Beverage,
    icon: <FaWineGlassAlt />,
  },
];

const CategoryRadio: NextPage<EditorProps> = (state) => {
  const initialLabel = CATEGORIES_FILTER.find(
    (item) => item.value === state.category
  )?.label;

  const dispatch = useContext(EditorContext);
  const [category, setCategory] = useState<string>(initialLabel!); // this only use for display

  const handleRadioSelect = (label: string, value: Category) => {
    setCategory(label);
    dispatch({ type: PostUpdateType.CATEGORY, payload: value });
  };

  return (
    <div>
      <p className="font-medium mb-2">
        Category
        <span className="font-normal text-zinc-600">
          {category && `: ${category}`}
        </span>
      </p>
      <ul className="flex gap-3 flex-wrap">
        {CATEGORY_BUTTON.map((item, idx) => (
          <label key={idx} htmlFor={item.label} className="category-radio">
            {item.icon}
            <input
              type="radio"
              name={PostFields.Category}
              id={item.label}
              value={item.value}
              checked={state.category === item.value}
              onChange={() => handleRadioSelect(item.label, item.value)}
              hidden
            />
          </label>
        ))}
      </ul>
    </div>
  );
};

export default CategoryRadio;
