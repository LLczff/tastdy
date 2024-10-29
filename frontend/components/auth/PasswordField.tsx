"use client";
// we make this component as client component to prevent the anti-pattern
// we just want this component to simplify the authentication form, not to take advantages of server component
// see https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#unsupported-pattern-importing-server-components-into-client-components

import { NextPage } from "next";
// Type
import { PasswordFieldProps } from "@/types/props";
// Icon
import { IoEye, IoEyeOff } from "react-icons/io5";

const PasswordField: NextPage<PasswordFieldProps> = (props) => {
  const handlePasswordVisibility = () => {
    return props.showState ? "text" : "password";
  };

  const toggleShowPassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    props.toggleStateFunc((prev) => !prev);
  };

  return (
    <div className="auth-field-container">
      <div className="auth-field-name">{props.fieldName}</div>
      <label htmlFor={props.fieldValue} className="auth-field-box">
        <input
          id={props.fieldValue}
          name={props.fieldValue}
          type={handlePasswordVisibility()}
          placeholder="" // we need empty placeholder to keep field-name as placeholder state
          autoComplete="on"
        />
        <button type="button" onClick={(e) => toggleShowPassword(e)}>
          {props.showState ? <IoEyeOff /> : <IoEye />}
        </button>
      </label>
    </div>
  );
};

export default PasswordField;
