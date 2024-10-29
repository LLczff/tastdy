"use client";
/**
 * this component should be used in client component
 * so, we make this a client component too
 */
// Icon
import { VscLoading } from "react-icons/vsc";

const Loading = () => {
  return <VscLoading className="animate-spin text-2xl mx-auto" />;
};

export default Loading;
