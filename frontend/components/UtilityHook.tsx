"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const UtilityHook = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string, reset: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set(name, value);

      // reset page
      if (reset) {
        params.set("page", "1");
      }

      return params.toString();
    },
    [searchParams]
  );

  const createMultiQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.append(name, value); // add value no matter it's duplicate
      params.set("page", "1"); // reset page
      return params.toString();
    },
    [searchParams]
  );

  const openLoginModal = () => {
    router.push(`${pathname}?` + createQueryString("sign", "in"), {
      scroll: false,
    });
    router.refresh(); // clear cache to re-display
  };

  const openPostModal = async (id: string) => {
    router.push(`${pathname}?` + createQueryString("post", id), {
      scroll: false,
    });
    router.refresh(); // clear cache to re-display
  };

  const closeModal = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?` + params.toString(), { scroll: false });
      router.refresh();
    },
    [searchParams]
  );

  return {
    createQueryString,
    createMultiQueryString,
    openLoginModal,
    openPostModal,
    closeModal,
  };
};

export default UtilityHook;
