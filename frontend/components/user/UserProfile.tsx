"use client";

import { useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
// Type
import { UserProfileProps } from "@/types/props";
// Component
import UserImageModal from "@/components/user/UserImageModal";
// Utility
import { truncateString } from "@/utils";
// Icon
import { MdPhotoCamera } from "react-icons/md";

const MAX_USERNAME_SHOWED = 12;

const UserProfile: NextPage<UserProfileProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleShowUploadModal = () => {
    if (props.owner) setIsModalOpen(true);
  };

  return (
    <section className="flex flex-col items-center gap-4 pt-8 xs:flex-row xs:justify-center xs:py-8">
      <figure
        className={`relative w-40 h-40 border-4 border-gray-200 rounded-full overflow-hidden ${
          props.owner && "group cursor-pointer"
        }`}
        onClick={handleShowUploadModal}
      >
        <Image
          src={props.image || "/fallback_profile.png"}
          alt="user-image"
          className="aspect-square rounded-full object-cover"
          fill
          priority
          sizes="100%"
        />
        {props.owner && (
          <figcaption
            className="absolute top-0 left-0 rounded-full bg-black bg-opacity-35 w-full h-full
              hidden group-hover:flex justify-center items-center"
          >
            <MdPhotoCamera className="mx-auto text-6xl text-neutral-200" />
          </figcaption>
        )}
      </figure>
      <div className="text-center xs:text-left leading-[3.5rem]">
        <h1 className="text-4xl font-medium">
          {truncateString(props.username, MAX_USERNAME_SHOWED)}
        </h1>
        <p>{props.totalPosts} posts</p>
      </div>
      {isModalOpen && (
        <UserImageModal closeFunc={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default UserProfile;
