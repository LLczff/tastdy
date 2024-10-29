"use client";

import { useRouter } from "next/navigation";
// Type
import { UserData } from "@/types";
// Server
import { auth } from "@/app/actions";
// Utility
import UtilityHook from "@/components/UtilityHook";

const CreateRecipeButton = () => {
  const router = useRouter();
  const { openLoginModal } = UtilityHook();

  const handleButtonClick = async () => {
    const user: UserData | null = await auth();
    // if user not authenticate, open login modal
    if (!user) {
      openLoginModal();
      return;
    }

    // otherwise, navigate to profile (for create a post)
    router.push(`/user/@${user._id}`);
  };

  return (
    <button
      type="button"
      className="btn-primary p-3"
      onClick={handleButtonClick}
    >
      Share Your Recipe
    </button>
  );
};

export default CreateRecipeButton;
