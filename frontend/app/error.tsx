"use client";

import Image from "next/image";
import Link from "next/link";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="main-container items-center gap-2">
      <Image
        src="/error.svg"
        alt="error"
        width={400}
        height={0}
        className="h-auto"
        priority
      />
      <h1 className="text-6xl font-extrabold">Oops!</h1>
      <h2 className="text-xl font-medium mb-3">Something went wrong.</h2>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </main>
  );
}

export default Error;
