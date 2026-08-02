import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "terminal-cv",
  description: "A terminal-like personal website. Explore with ls and cat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://www.googletagmanager.com/gtag/js?id=G-WWES1B0RFM"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WWES1B0RFM');
          `}
        </script>
      </head>
      <body className={`${geistMono.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
