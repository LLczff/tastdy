"use client";

import { useEffect } from "react";
import { NextPage } from "next";
// Type
import { ModalProps } from "@/types/props";
// Icon
import { TfiClose } from "react-icons/tfi";

const Modal: NextPage<ModalProps> = (props) => {
  // DOM cannot be access via SSR
  // we need to make this as client component and use useEffect hook
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-bg">
      <section
        className={`relative bg-white rounded-sm px-3 w-full ${
          props.className
        } ${props.closeFunc ? "pt-8 pb-4" : "py-4"}`}
      >
        {props.closeFunc && (
          <button
            className="absolute top-2 right-2 text-zinc-500"
            onClick={props.closeFunc}
          >
            <TfiClose size={20} />
          </button>
        )}
        {props.children}
      </section>
    </div>
  );
};

export default Modal;
