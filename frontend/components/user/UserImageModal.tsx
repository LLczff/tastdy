"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { NextPage } from "next";
// Type
import { CloseFunctionProps } from "@/types/props";
// Component
import Modal from "@/components/Modal";
import SubmitButton from "@/components/SubmitButton";
import ImageUploader from "@/components/user/ImageUploader";
// Server
import { uploadUserImage } from "@/app/actions";
// Constant
import { INITIAL_FORM_ACTION_STATE } from "@/constants";

const UserImageModal: NextPage<CloseFunctionProps> = ({ closeFunc }) => {
  // form action
  const [state, action] = useFormState(
    uploadUserImage,
    INITIAL_FORM_ACTION_STATE
  );

  useEffect(() => {
    if (state.success) {
      // Close modal and refresh image profile
      closeFunc();
    }
  }, [state.success]);

  return (
    <Modal className="max-w-sm">
      <form action={action}>
        <ImageUploader />
        {state.error && (
          <p className="text-red-500 text-center text-xs mb-3">{state.error}</p>
        )}
        <div className="flex gap-2">
          <button
            className="btn-secondary w-full"
            type="button"
            onClick={closeFunc}
          >
            Discard
          </button>
          <SubmitButton label="Upload" />
        </div>
      </form>
    </Modal>
  );
};

export default UserImageModal;
