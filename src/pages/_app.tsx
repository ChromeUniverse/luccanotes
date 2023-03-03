import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

import { Inter } from "@next/font/google";
import useThemeStore from "../stores/theme";
// import useHasHydrated from "../hooks/useHasHydrated";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  // pageProps,
}) => {
  const { theme } = useThemeStore();

  const { pathname } = useRouter();
  console.log(pathname);

  useEffect(() => {
    if (pathname === "/") return;

    theme === "dark"
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark");
  }, [theme, pathname]);

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
