import { Noto_Sans, Bodoni_Moda, Dancing_Script } from "next/font/google";

// We use Noto Sans as default font hence we set in the body of globals.css
// Other than that, set them as variable in tailwind.config.ts

export const noto_sans = Noto_Sans({
  // weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
});

export const bodoni_moda = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni-moda",
  adjustFontFallback: false,
});

export const dancing_script = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dance",
  adjustFontFallback: false,
});
