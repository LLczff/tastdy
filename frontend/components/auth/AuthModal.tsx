"use client";

import { NextPage } from "next";
// Type
import { AuthModalProps } from "@/types/props";
// Component
import Modal from "@/components/Modal";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
// Utility
import UtilityHook from "@/components/UtilityHook";

const AuthModal: NextPage<AuthModalProps> = ({ sign }) => {
  const { closeModal } = UtilityHook();

  function renderForm() {
    switch (sign) {
      case "in":
        return <LoginForm />;
      case "up":
        return <SignUpForm />;
      default:
        return <></>;
    }
  }

  // Modal component will inherit close function from context
  return (
    <Modal className="max-w-72" closeFunc={() => closeModal("sign")}>
      {renderForm()}
    </Modal>
  );
};

export default AuthModal;
