import Image from "next/image";
import Link from "next/link";

function NotFound() {
  return (
    <main className="main-container items-center gap-2">
      <Image
        src="/user_not_found.svg"
        alt="user_not_found"
        width={400}
        height={0}
        className="h-auto"
        priority
      />
      <h1 className="text-6xl font-extrabold">404</h1>
      <h2 className="text-xl font-medium mb-3">User not found</h2>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
