"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// Type
import { FormDataFields } from "@/types";
// Component
import NormalField from "@/components/auth/NormalField";
import PasswordField from "@/components/auth/PasswordField";
import SubmitButton from "@/components/SubmitButton";
// Server
import { login } from "@/app/actions";
// Constant
import { INITIAL_FORM_ACTION_STATE } from "@/constants";
// Utility
import UtilityHook from "@/components/UtilityHook";

const LoginForm = () => {
  // For toggle modal state
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const { createQueryString } = UtilityHook();
  // State
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [state, action] = useFormState(login, INITIAL_FORM_ACTION_STATE);

  const toggleAuthModal = () => {
    router.push(`${pathname}?` + createQueryString("sign", "up"), {
      scroll: false,
    });
    router.refresh(); // clear cache to re-display the new form
  };

  useEffect(() => {
    if (state.success) {
      // Close modal
      params.delete("sign");
      router.push(`${pathname}?` + params.toString());
      router.refresh();
    }
  }, [state.success]);

  return (
    <form className="auth-form" action={action}>
      <h2>Login</h2>
      <NormalField fieldName="Username" fieldValue={FormDataFields.Username} />
      <PasswordField
        fieldName="Password"
        fieldValue={FormDataFields.Password}
        showState={showPassword}
        toggleStateFunc={setShowPassword}
      />
      <p className="error">{state.error}</p>
      <SubmitButton label="Login" />
      <p className="auth-form-switch">
        Don't have an account? <span onClick={toggleAuthModal}>Sign Up</span>
      </p>
    </form>
  );
};

export default LoginForm;
