import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/packages";
import "./globals.css";

// Self-hosted (variable, latin) so builds never depend on fetching Google Fonts.
const montserrat = localFont({
  src: "./fonts/Montserrat-latin.woff2",
  weight: "700 900",
  variable: "--font-montserrat",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/Manrope-latin.woff2",
  weight: "400 800",
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.svg" },
  openGraph: { siteName: "ViralMoniPoint", images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#FFC400",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${manrope.variable}`}>
      <head>
        {/* Google tag (gtag.js) — same property as the homepage */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BQFXSMT7K3" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BQFXSMT7K3');",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
