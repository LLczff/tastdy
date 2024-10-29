"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
// Type
import { FormDataFields } from "@/types";
// Component
import NormalField from "@/components/auth/NormalField";
import PasswordField from "@/components/auth/PasswordField";
import SubmitButton from "@/components/SubmitButton";
// Server
import { signUp } from "@/app/actions";
// Constant
import { INITIAL_FORM_ACTION_STATE } from "@/constants";
// Icon
import { IoIosCheckmarkCircle } from "react-icons/io";
// Utility
import UtilityHook from "@/components/UtilityHook";

const SignUpForm = () => {
  // For toggle modal state
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = UtilityHook();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [state, action] = useFormState(signUp, INITIAL_FORM_ACTION_STATE);

  const toggleAuthModal = () => {
    router.push(`${pathname}?` + createQueryString("sign", "in"));
    router.refresh(); // clear cache to re-display the new form
  };

  return (
    <>
      {!state.success ? (
        <form className="auth-form" action={action}>
          <h2>Sign up</h2>
          <NormalField
            fieldName="Username"
            fieldValue={FormDataFields.Username}
          />
          <PasswordField
            fieldName="Password"
            fieldValue={FormDataFields.Password}
            showState={showPassword}
            toggleStateFunc={setShowPassword}
          />
          <PasswordField
            fieldName="Confirm Password"
            fieldValue={FormDataFields.ConfirmPassword}
            showState={showPassword}
            toggleStateFunc={setShowPassword}
          />
          <p className="error">{state.error}</p>
          <SubmitButton label="Sign Up" />
          <p className="auth-form-switch">
            Already have an account?&nbsp;
            <span onClick={toggleAuthModal}>Login</span>
          </p>
        </form>
      ) : (
        <div className="text-center">
          <IoIosCheckmarkCircle className="text-8xl text-primary mx-auto" />
          <p className="font-medium text-lg mb-4">Register success</p>
          <button className="btn-primary w-full" onClick={toggleAuthModal}>
            Go to Login
          </button>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
