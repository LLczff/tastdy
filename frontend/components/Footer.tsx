import Link from "next/link";
// Icon
import { SiGithub } from "react-icons/si";
import { FaLink } from "react-icons/fa6";

const contact = [
  {
    icon: <FaLink size={20} />,
    link: "https://llczff.github.io",
  },
  {
    icon: <SiGithub size={20} />,
    link: "https://github.com/LLczff",
  },
];

const Footer = () => {
  return (
    <footer className="flex gap-4 w-full bg-neutral-800 items-center justify-between px-2 py-2 text-white">
      {/* <Image src="/logo.png" width={32} height={32} alt="logo" /> */}
      <p className="text-xs">&copy; 2024 LLczff. All rights reserved</p>
      <ul className="flex gap-2">
        {contact.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            target="_blank"
            className="hover:opacity-50"
          >
            {item.icon}
          </Link>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
