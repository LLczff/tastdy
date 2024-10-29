import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
// Type
import { HeaderProps } from "@/types/props";
// Component
import UserBar from "@/components/header/UserBar";
import LoginButton from "@/components/header/LoginButton";

const Header: NextPage<HeaderProps> = (props) => {
  return (
    <header className="flex w-full bg-white items-center justify-between px-2 py-1">
      <Link href="/">
        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="logo"
          priority
          className="inline-block"
        />
        <span className="font-dance text-logo text-2xl font-bold select-none align-middle ml-1">
          Tastdy
        </span>
      </Link>
      {props.user ? (
        <UserBar {...props.user} />
      ) : (
        // Link not work, we use this way instead
        <LoginButton />
      )}
    </header>
  );
};

export default Header;
