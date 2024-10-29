"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// Type
import { UserData } from "@/types";
// Constant
import { DROPDOWN_ITEM_HEIGHT } from "@/constants";
// Server
import { removeToken } from "@/app/actions";
// Icon
import { LuUser2 } from "react-icons/lu";
import { RiLogoutBoxRLine } from "react-icons/ri";

// ceil calculation to nearest 5
const USER_BAR_ITEMS = 2;
const DROPDOWN_MAX_HEIGHT =
  Math.ceil((DROPDOWN_ITEM_HEIGHT * USER_BAR_ITEMS) / 5) * 5;

const UserBar: NextPage<UserData> = (props) => {
  const router = useRouter();
  // State
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // Ref
  const dropdownRef = useRef<HTMLImageElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement; // prevent TypeScript warning

      // Only not close when clicking on user icon
      if (
        dropdownRef.current &&
        dropdownListRef.current &&
        !dropdownRef.current.contains(target) &&
        !dropdownListRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const signOut = async () => {
    await removeToken();
    // prevent user stayed in private page (middleware will be triggered)
    router.refresh();
  };

  return (
    <div className="relative w-9 h-9">
      <Image
        ref={dropdownRef}
        src={props.image || "/fallback_profile.png"}
        fill
        sizes="100%"
        alt="user-icon"
        className="aspect-square rounded-full cursor-pointer object-cover"
        onClick={() => setShowDropdown((prev) => !prev)}
      />
      <ul
        ref={dropdownListRef}
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
          <Link href={`/user/@${props._id}`} className="dropdown-sm-item">
            <LuUser2 className="dropdown-sm-icon" />
            <span>&nbsp;Profile</span>
          </Link>
        </li>
        <li className="dropdown-sm-list">
          <button className="dropdown-sm-item" onClick={signOut}>
            <RiLogoutBoxRLine className="dropdown-sm-icon" />
            <span>&nbsp;Sign out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserBar;
