"use client";
// we make this component as client component to prevent the anti-pattern
// we just want this component to simplify the authentication form, not to take advantages of server component
// see https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#unsupported-pattern-importing-server-components-into-client-components

import { NextPage } from "next";
// Type
import { NormalFieldProps } from "@/types/props";

const NormalField: NextPage<NormalFieldProps> = ({ fieldName, fieldValue }) => {
  return (
    <div className="auth-field-container">
      <div className="auth-field-name">{fieldName}</div>
      <label htmlFor={fieldValue} className="auth-field-box">
        <input
          id={fieldValue}
          name={fieldValue}
          type="text"
          placeholder="" // we need empty placeholder to keep field-name as placeholder state
        />
      </label>
    </div>
  );
};

export default NormalField;
