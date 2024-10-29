"use client";

// Utility
import UtilityHook from "@/components/UtilityHook";

const LoginButton = () => {
  const { openLoginModal } = UtilityHook();
  return (
    <button type="button" className="btn-primary" onClick={openLoginModal}>
      Login
    </button>
  );
};

export default LoginButton;
