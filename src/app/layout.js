import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/shared/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0d0c' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: {
    default: "RecipeHub - Discover & Share Delicious Recipes",
    template: "%s | RecipeHub",
  },
  description: "RecipeHub is a full-stack platform for food lovers to share, explore, and create gourmet recipes.",
  keywords: ["recipes", "cooking", "food sharing", "gourmet", "culinary", "RecipeHub"],
  authors: [{ name: "RecipeHub Team" }],
  openGraph: {
    title: "RecipeHub - Discover & Share Delicious Recipes",
    description: "RecipeHub is a full-stack platform for food lovers to share, explore, and create gourmet recipes.",
    siteName: "RecipeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecipeHub - Discover & Share Delicious Recipes",
    description: "Share and discover amazing recipes around the globe.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black text-black dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '14px',
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid rgba(160, 160, 160, 0.2)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
                fontSize: '14px',
              },
            }}
          />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

