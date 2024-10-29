"use client";

import { useState } from "react";
import { NextPage } from "next";
// Type
import { PostKebabProps } from "@/types/props";
// Constant
import { DROPDOWN_ITEM_HEIGHT } from "@/constants";
// Icon
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

// ceil calculation to nearest 5
const KEBAB_ITEMS = 2;
const DROPDOWN_MAX_HEIGHT =
  Math.ceil((DROPDOWN_ITEM_HEIGHT * KEBAB_ITEMS) / 5) * 5;

const PostKebab: NextPage<PostKebabProps> = ({
  openEditorFunc,
  deletePostFunc,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <HiOutlineDotsVertical size={24} />
        <ul
          // bottom should be equal to border-top-width to make the box perfectly align
          className="absolute text-black rounded-sm shadow-md bg-slate-50 -bottom-2 right-0 min-w-fit 
        translate-y-full divide-y duration-200 overflow-hidden z-10"
          style={{
            opacity: showDropdown ? 1 : 0,
            // use the number that can cover the element
            maxHeight: showDropdown ? `${DROPDOWN_MAX_HEIGHT}px` : 0,
          }}
          // since it will close before the list function execute, we cannot do this in handleClickOutside
          onClick={() => setShowDropdown(false)}
        >
          <li className="dropdown-sm-list">
            <button className="dropdown-sm-item" onClick={openEditorFunc}>
              <BiSolidEditAlt className="dropdown-sm-icon" />
              <span>&nbsp;Edit</span>
            </button>
          </li>
          <li className="dropdown-sm-list">
            <button className="dropdown-sm-item" onClick={deletePostFunc}>
              <MdDeleteForever className="dropdown-sm-icon" />
              <span>&nbsp;Delete</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default PostKebab;
