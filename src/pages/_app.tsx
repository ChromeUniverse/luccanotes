import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

import { Inter } from "@next/font/google";
import useThemeStore from "../stores/theme";
import useHasHydrated from "../hooks/useHasHydrated";
import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { theme } = useThemeStore();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    theme === "dark"
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark");
  }, [theme]);

  // if (!hasHydrated) {
  //   return <span>Loading...</span>;
  // }

  return (
    <>
      {/* Inter font wrapper */}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
