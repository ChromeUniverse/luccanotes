import { type GetServerSidePropsContext, type NextPage } from "next";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";

// Phosphor and FontAwesome icons
import {
  BookBookmark,
  Eye,
  FloppyDisk,
  Keyboard,
  MagnifyingGlass,
  Tag,
} from "phosphor-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";
import Navbar from "../components/Navbar";
import Head from "next/head";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/notes",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: { session: null } };
};

const iconProps = {
  className:
    "rounded-tl-xl md:rounded-full bg-blue-600 h-16 md:h-14 w-16 md:w-14 p-3.5 md:p-3 text-white md:drop-shadow-md",
  weight: "bold",
} as const;

type Feature = {
  icon: JSX.Element;
  title: string;
  content: string;
};

const features: Feature[] = [
  {
    icon: (
      <div className="flex h-16 w-16 items-center justify-center rounded-tl-xl bg-blue-600 text-white drop-shadow-md md:h-14 md:w-14 md:rounded-full">
        <FontAwesomeIcon size="xl" icon={faMarkdown} />
      </div>
    ),
    title: "GitHub Flavored Markdown",
    content:
      "The best flavor of Markdown! The GFM spec is supported by LuccaNotes' text editor and Markdown renderer for note previews.",
  },
  {
    icon: <FloppyDisk {...iconProps} />,
    title: "Auto-saving",
    content:
      "Changes to your notes are automatically saved to LuccaNotes' backend, meaning you'll never need to worry about losing your work.",
  },
  {
    icon: <Tag {...iconProps} />,
    title: "Tags keep notes tidy",
    content:
      "Our tagging system allows you to effortlessly group, organize, and search through your notes - regardless if you have 5 or 5000!",
  },
  {
    icon: <Eye {...iconProps} />,
    title: "Note previews",
    content:
      "The toggleable Markdown preview displays a fully rendered version of your note's content as you type it out in the text editor.",
  },
  {
    icon: <Keyboard {...iconProps} />,
    title: "Keyboard navigation & a11y",
    content:
      "LuccaNotes is built with full accessibility in mind. In addition to a more inclusive UX, this allows for speedy keyboard navigation throughout the entire app.",
  },
  {
    icon: <MagnifyingGlass {...iconProps} />,
    title: "Sort, Filter & Search",
    content:
      "A sensible and easy-to-use search tool lets you quickly browse your collection and find the note you're looking for. It's as simple as that!",
  },
];

function FeatureCard({ feature: f }: { feature: Feature }) {
  return (
    <div className="relative flex flex-col items-start gap-3.5 overflow-clip rounded-lg bg-gray-100 px-6 pt-6 pb-16 drop-shadow-md transition-colors md:border-2 md:border-transparent md:pb-8 md:hover:border-blue-600 md:hover:bg-gray-50">
      {/* Icon */}
      <div className="absolute -bottom-0 -right-0 opacity-50 md:relative md:block md:opacity-100">
        {f.icon}
      </div>
      {/* Title */}
      <h3 className="z-10 text-xl font-bold text-gray-900">{f.title}</h3>
      {/* Content */}
      <p className="z-10 text-gray-600">{f.content}</p>
    </div>
  );
}

function Section({
  id,
  title,
  heading,
  description,
  children,
}: {
  id: string;
  title: string;
  heading: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="w-full bg-white py-16">
      <div className="mx-auto space-y-3 px-6 md:w-[90%] md:max-w-[1200px]">
        <h2 className="font-semibold text-blue-600">{title}</h2>
        <p className="text-3xl font-extrabold text-gray-950 md:text-4xl">
          {heading}
        </p>
        <p className="max-w-3xl text-gray-600">{description}</p>
        {children}
      </div>
    </section>
  );
}

function TechLogo({
  label,
  src,
  link,
  tooltipPosition = "bottom",
  rounded = false,
}: {
  label: string;
  src: string;
  link: string;
  tooltipPosition?: "bottom" | "top";
  rounded?: boolean;
}) {
  return (
    <div className="">
      <a
        className="relative mx-auto flex items-center justify-center transition-all hover:scale-110 md:w-20"
        target="_blank"
        rel="noreferrer noopener"
        href={link}
      >
        <img
          className={`peer z-10 h-16 w-16 object-contain drop-shadow-lg md:h-20 md:w-20 ${
            rounded ? "rounded-2xl lg:rounded-3xl" : ""
          }`}
          src={src}
          alt="A logo"
        />
        <Tooltip tooltipPosition={tooltipPosition} alignment="xCenter">
          <span className="">{label}</span>
        </Tooltip>
      </a>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex scale-75 items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
        <BookBookmark color="white" size={28} />
      </div>
      <span className="text-2xl font-medium text-gray-600 dark:text-gray-200">
        LuccaNotes
      </span>
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>LuccaNotes • Note-taking app for Markdown lovers 💙</title>
      </Head>

      <main className="flex flex-grow flex-col bg-gray-200">
        {/* Hero section */}
        <section
          id="hero"
          className="relative w-full border-b-2 border-b-gray-200 bg-gray-100 pb-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Navbar with transparent background */}
          <Navbar bgTransparent />

          {/* Title */}
          <div className="px-5">
            <h1 className="mx-auto mt-16 text-center text-4xl font-extrabold leading-tight tracking-tighter text-gray-900 xl:max-w-5xl xl:text-6xl xl:leading-tight">
              The open-source note-taking app for Markdown lovers 💙
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-4 max-w-4xl text-center text-lg text-gray-600">
              A no-frills web app for all your Markdown note-taking needs,
              laser-focused on productivity and unobtrusive UX, and powered by
              awesome open-source tech.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-5 flex items-center justify-center gap-5">
            <Button
              intent="outline"
              label="Source"
              tooltipAlignment="xCenter"
              tooltipPosition="bottom"
              icon="github"
              size="rectangle"
              href="https://github.com/ChromeUniverse/luccanotes"
              shadow
            />
            <Button
              intent="primary"
              label="Get started"
              tooltipAlignment="xCenter"
              tooltipPosition="bottom"
              // icon="sign-in"
              reverse
              size="rectangle"
              onClick={() => void signIn(undefined, { callbackUrl: "/notes" })}
              shadow
            />
          </div>

          <img
            className="mx-auto mt-16 block max-w-xs rounded-lg border-2 border-gray-200 drop-shadow-2xl md:hidden"
            src="/images/notes-mobile-light.jpg"
            alt="A preview of the main dashboard for LuccaNotes"
          />

          {/* Hero image (desktop) */}
          <img
            className="mx-auto mt-16 hidden rounded-lg border-2 border-gray-200 drop-shadow-2xl md:block lg:max-w-5xl xl:max-w-6xl"
            src="/images/notes-light.png"
            alt="A preview of the main dashboard for LuccaNotes"
          />
        </section>

        {/* Features section */}
        <Section
          id="features"
          title="Features"
          heading="Just the essentials."
          description="LuccaNotes ships with a sleek, yet minimal UI and a condensed
              feature set to help you avoid distractions and maximize your
              note-taking productivity."
        >
          {/* Feature cards */}
          <div className="grid gap-7 pt-12 md:grid-cols-3">
            {features.map((f, index) => (
              <FeatureCard key={index} feature={f} />
            ))}
          </div>
        </Section>

        {/* Technologies section */}
        <Section
          id="technologies"
          title="Technologies"
          heading="Built with awesome open-source tech."
          description="Huge thanks to the amazing people who build and maintain the
          programming languages, libraries, frameworks, databases, tooling,
          and platforms that power LuccaNotes. Go check them out!"
        >
          {/* Logos */}
          <div className="grid grid-cols-4 place-items-center gap-x-8 gap-y-10 px-2.5 pt-12 md:grid-cols-8 md:px-0">
            <TechLogo
              label="TypeScript"
              link="https://www.typescriptlang.org/"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png"
              tooltipPosition="top"
            />
            <TechLogo
              label="Next.js"
              link="https://nextjs.org/"
              src="/images/logos/nextjs-dark.svg"
              tooltipPosition="top"
            />
            <TechLogo
              label="create-t3-app"
              link="https://create.t3.gg/"
              src="https://create.t3.gg/favicon.svg"
              tooltipPosition="top"
              rounded
            />
            <TechLogo
              label="Tailwind CSS"
              link="https://tailwindcss.com/"
              src="/images/logos/tailwindcss.svg"
              tooltipPosition="top"
            />
            <TechLogo
              label="Headless UI"
              link="https://headlessui.com/"
              src="/images/logos/headless-ui.svg"
              tooltipPosition="top"
            />
            <TechLogo
              label="Prisma"
              link="https://prisma.io/"
              src="/images/logos/prisma.jpg"
              rounded
              tooltipPosition="top"
            />
            <TechLogo
              label="tRPC"
              link="https://trpc.io/"
              src="https://trpc.io/img/logo.svg"
              tooltipPosition="top"
            />
            <TechLogo
              label="TanStack Query"
              link="https://tanstack.com/query/latest"
              src="https://react-query-v3.tanstack.com/_next/static/images/emblem-light-628080660fddb35787ff6c77e97ca43e.svg"
              tooltipPosition="top"
            />
            <TechLogo
              label="NextAuth.js"
              link="https://next-auth.js.org/"
              src="https://next-auth.js.org/img/logo/logo-sm.png"
            />
            <TechLogo
              label="Codemirror"
              link="https://codemirror.net/"
              src="https://codemirror.net/favicon.ico"
            />
            <TechLogo
              label="Phosphor Icons"
              link="https://phosphoricons.com/"
              src="https://phosphoricons.com/favicon-512.png"
            />
            <TechLogo
              label="Font Awesome"
              link="https://fontawesome.com/"
              src="/images/logos/fa.svg"
            />
            <TechLogo
              label="Zod"
              link="https://zod.io/"
              src="/images/logos/zod.svg"
            />
            <TechLogo
              label="PostgreSQL"
              link="https://www.postgresql.org/"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1985px-Postgresql_elephant.svg.png"
            />
            <TechLogo
              label="Supabase"
              link="https://supabase.com/"
              src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png"
            />
            <TechLogo
              label="Vercel"
              link="https://vercel.com/"
              src="https://static-00.iconduck.com/assets.00/vercel-icon-512x449-3422jidz.png"
            />
          </div>
        </Section>

        {/* CTA section */}
        <Section
          id="cta"
          title="Get started"
          heading="Ready to start taking notes?"
          description=" Sign in with your favorite social login provider, create a new
              note and start writing right away — no registration, no fluff,
              nothing. Okay, maybe add a tag or two for tidiness' sake, but
              that's up to you :-)"
        >
          {/* Sign in button */}
          <div className="pt-4 pb-12">
            <Button
              intent="primary"
              label="Sign in"
              tooltipAlignment="xCenter"
              tooltipPosition="bottom"
              icon="sign-in"
              reverse
              size="rectangle"
              onClick={() => void signIn(undefined, { callbackUrl: "/notes" })}
              shadow
            />
          </div>

          {/* Editor preview image (desktop) */}
          <img
            className="mx-auto mb-10 mt-16 hidden rounded-lg border-2 border-gray-200 drop-shadow-xl md:block lg:max-w-5xl xl:max-w-6xl"
            src="/images/editor-light.png"
            alt="A preview of the editor and preview for LuccaNotes (desktop)"
          />

          {/* Editor preview image (mobile) */}

          <div className="relative mt-16 block h-[700px] md:hidden">
            <img
              className="absolute top-0 left-0 mx-auto block max-w-[16rem] rounded-lg border-2 border-gray-200 drop-shadow-2xl md:hidden"
              src="/images/editor-mobile-light.jpg"
              alt="A preview of the text editor panel in LuccaNotes (mobile)"
            />
            <img
              className="absolute bottom-0 right-0 mx-auto block max-w-[16rem] rounded-lg border-2 border-gray-200 drop-shadow-2xl md:hidden"
              src="/images/preview-mobile-light.jpg"
              alt="A preview of the Markdown preview panel in LuccaNotes (mobile)"
            />
          </div>
        </Section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-center gap-4 border-t-2 border-t-gray-200 bg-gray-50 px-16 py-6 pt-8 pb-16">
          <Logo />
          <p className="text-base text-gray-400">
            Built with 💙 by{" "}
            <a
              className="text-gray-500 underline decoration-transparent
               decoration-2 hover:text-blue-600 hover:decoration-blue-600"
              target="_blank"
              rel="noopener noreferrer"
              href="http://blaring.net/"
            >
              Lucca Rodrigues
            </a>{" "}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
