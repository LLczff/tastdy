"use client";
/**
 * we use this component to acheive useFormStatus hook
 * see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#pending-states
 */

import { useFormStatus } from "react-dom";
import { NextPage } from "next";
// Type
import { SubmitButtonProps } from "@/types/props";
// Component
import Loading from "@/components/Loading";

const SubmitButton: NextPage<SubmitButtonProps> = ({ label }) => {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn-primary w-full disabled:select-none disabled:cursor-default disabled:bg-gray-300"
      type="submit"
      disabled={pending}
    >
      {pending ? <Loading /> : <span>{label}</span>}
    </button>
  );
};

export default SubmitButton;
