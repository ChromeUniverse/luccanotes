import {
  faDiscord,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { BookBookmark } from "phosphor-react";
import React from "react";
import PageLayout from "../../components/Layouts/Page";
import { getServerAuthSession } from "../../server/auth";

function Logo() {
  return (
    <Link className="h group flex items-center gap-3" href="/">
      {/* Icon */}
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 group-hover:brightness-90">
        <BookBookmark color="white" size={64} />
      </div>
      {/* App Name */}
      {/* <span className="hidden text-2xl font-medium text-gray-600 dark:text-gray-200 md:block">
        LuccaNotes
      </span> */}
    </Link>
  );
}

const iconProps = {
  className: "text-white text-xl",
};

function signin({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-10 bg-gray-200">
      {/* Logo */}
      <Logo />

      {/* Login options */}
      <div className="flex flex-col items-center gap-5 rounded-lg bg-white px-12 py-6">
        <span className="text-lg text-gray-600">Sign in with</span>

        <div className="flex flex-col gap-2">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="flex w-40 items-center justify-center gap-2 rounded-lg bg-gray-400 py-3 transition-colors hover:bg-blue-600"
                onClick={() => void signIn(provider.id)}
              >
                <div className="flex w-6 items-center justify-center">
                  {provider.id === "discord" && (
                    <FontAwesomeIcon icon={faDiscord} {...iconProps} />
                  )}
                  {provider.id === "google" && (
                    <FontAwesomeIcon icon={faGoogle} {...iconProps} />
                  )}
                  {provider.id === "github" && (
                    <FontAwesomeIcon icon={faGithub} {...iconProps} />
                  )}
                </div>
                <span className="text-lg font-semibold text-white">
                  {provider.name}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: { destination: "/notes" },
    };
  }

  const providers = await getProviders();

  return { props: { providers: providers ?? [] } };
};

export default signin;
