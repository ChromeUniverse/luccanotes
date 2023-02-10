import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

import { Inter } from "@next/font/google";
import useThemeStore from "../stores/theme";
import useHasHydrated from "../hooks/useHasHydrated";

const inter = Inter({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { theme } = useThemeStore();
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return <span>Loading...</span>;
  }

  return (
    <div className={inter.className}>
      <div className={theme === "dark" ? "dark" : ""}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
