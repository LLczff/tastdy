"use client";

import { useState, useRef } from "react";
import { NextPage } from "next";
import Image from "next/image";
// Type
import { RecipePost, ErrorMessage, Tag } from "@/types";
import { UserPostProps } from "@/types/props";
// Component
import PostEditor from "@/components/post/PostEditor";
import PostKebab from "@/components/post/PostKebab";
import Modal from "@/components/Modal";
// Server
import { getData, deleteRecipe } from "@/app/actions";
// Utility
import UtilityHook from "@/components/UtilityHook";
import { truncateString } from "@/utils";
// Icon
import { IoHeart } from "react-icons/io5";
import { TbFolderCancel } from "react-icons/tb";
import { HiPlus } from "react-icons/hi2";

const MAX_POST_NAME_SHOWED = 20;

const UserPost: NextPage<UserPostProps> = ({ owner, totalPosts, posts }) => {
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [postData, setPostData] = useState<RecipePost | null>(null);
  const modifyRef = useRef<HTMLDivElement>(null);
  const { openPostModal } = UtilityHook();

  // Open read-only post
  const handleOpenPost = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    const target = event.target as HTMLElement;

    // on other user account
    if (!owner) {
      openPostModal(id);
      return;
    }

    // on own account, open when not clicking on kebab
    if (modifyRef.current && !modifyRef.current.contains(target))
      openPostModal(id);
  };

  // Open post editor with fetched data
  const openPostModifier = async (id: string) => {
    try {
      const post: RecipePost | null = await getData(
        `/recipe/${id}`,
        Tag.SingleRecipe
      );
      setPostData(post);
    } catch (error) {
      throw new Error(ErrorMessage.ServerError);
    }
    setPostModalOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteRecipe(id);
    } catch (error) {
      throw new Error(ErrorMessage.ServerError);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) handleDeletePost(deleteTarget);
    setDeleteTarget(null);
  };

  // Close post editor
  const closePostEditor = () => {
    setPostData(null);
    setPostModalOpen(false);
  };

  return (
    <>
      {!owner && totalPosts === 0 ? (
        <section className="text-center font-medium mt-20 text-gray-300">
          <TbFolderCancel className="text-6xl mx-auto" />
          <p className="text-2xl px-5">No posts</p>
        </section>
      ) : (
        <section className="grid gap-0.5 pb-0.5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {owner && (
            <button
              type="button"
              className="bg-neutral-200 text-neutral-400 aspect-4/3 hover:bg-black hover:text-zinc-600 hover:bg-opacity-10"
              onClick={() => setPostModalOpen(true)}
            >
              <HiPlus size={64} className="mx-auto" />
            </button>
          )}
          {totalPosts > 0 &&
            posts.map((item, idx) => (
              <figure
                key={idx}
                className="group relative w-full aspect-4/3 cursor-pointer hover:bg-black hover:bg-opacity-60"
                onClick={(e) => handleOpenPost(e, item._id)}
              >
                <Image
                  src={item.image}
                  alt={item.dish + "_" + item.author}
                  className="rounded-sm object-cover group-hover:opacity-60"
                  fill
                  sizes="100%, (min-width: 576px) 50%, (min-width: 1024px) 33.33%, (min-width: 1280px) 25%, (min-width: 1536px) 20%"
                />
                <figcaption
                  className="absolute bottom-0 left-0 user-post-caption w-full rounded-b-sm 
                flex justify-between items-baseline px-2 pt-3 pb-2 text-white"
                >
                  <span className="font-medium text-lg">
                    {truncateString(item.dish, MAX_POST_NAME_SHOWED)}
                  </span>
                  <div className="text-red-500">
                    <IoHeart className="inline-block text-2xl lg:text-xl" />
                    <span className="align-bottom lg:text-sm">
                      &nbsp;{item.favorite} liked
                    </span>
                  </div>
                </figcaption>
                {owner && (
                  <div
                    ref={modifyRef}
                    className="absolute top-2 right-2 text-white hidden hover:bg-opacity-40 group-hover:block"
                  >
                    <PostKebab
                      openEditorFunc={() => openPostModifier(item._id)}
                      deletePostFunc={() => setDeleteTarget(item._id)}
                    />
                  </div>
                )}
              </figure>
            ))}
        </section>
      )}
      {/* It will open modifier if data is present. otherwise, open creater */}
      {postModalOpen && (
        <PostEditor closeFunc={closePostEditor} post={postData} />
      )}
      {deleteTarget && (
        <Modal className="max-w-72">
          <h3 className="text-center text-xl font-semibold mb-2">
            Delete recipe?
          </h3>
          <p className="text-center text-sm font-light mb-3">
            Your post will lost forever.
          </p>
          <div className="flex gap-2">
            <button
              className="btn-secondary w-full"
              type="button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button
              className="btn-danger w-full"
              type="button"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserPost;
