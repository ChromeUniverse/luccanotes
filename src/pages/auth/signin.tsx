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
import Button from "../../components/Button";
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
  className: "text-blue-600 text-xl group-hover:text-white",
};

function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className="flex h-screen flex-col items-center justify-center gap-10 bg-gray-100"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Logo */}
      <Logo />

      {/* Login options */}
      <div className="flex flex-col items-center gap-5 rounded-xl border-2 border-gray-200 bg-white px-16 py-10">
        <p className="text-lg text-gray-500">Sign in with</p>

        {/* Login buttons container */}
        <div className="flex flex-col gap-4">
          {Object.values(providers).map((provider) => (
            // Login button
            <button
              key={provider.name}
              className="group flex w-40 items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-white py-3 transition-colors hover:bg-blue-600"
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
              <span className="text-lg font-semibold text-blue-600 group-hover:text-white">
                {provider.name}
              </span>
            </button>
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

export default SignInPage;
