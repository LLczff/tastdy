/**
 * This file need it's own HTML and CSS
 */
"use client";

import { useState } from "react";

function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main
          className="global-error gap-2"
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: '"Noto Sans", sans-serif',
          }}
        >
          <img
            src="/global_error.svg"
            alt="global_error"
            style={{ width: "400px", height: "auto" }}
          />
          <h1
            style={{
              fontSize: "3.75rem",
              lineHeight: 1,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Whoa!
          </h1>
          <h2
            className="text-xl font-medium mb-3"
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
              fontWeight: 500,
              marginBottom: "0.75rem",
            }}
          >
            You should not be here.
          </h2>
          <a
            href="/"
            style={{
              backgroundColor: isHover ? "#00a365" : "#008f58",
              borderRadius: "0.125rem",
              padding: "0.25rem 0.5rem",
              color: "#fff",
              transition: "all cubic-bezier(0.4, 0, 0.2, 1) 300ms",
              fontSize: "1.5rem",
              textDecoration: "none",
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            Back to Home
          </a>
        </main>
      </body>
    </html>
  );
}

export default GlobalError;
