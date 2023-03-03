import { type GetServerSidePropsContext, type NextPage } from "next";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import PageLayout from "../components/Layouts/Page";
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
  className: "rounded-full bg-blue-600 h-14 w-14 p-3 text-white drop-shadow-md",
  // size: 20,
  weight: "bold",
} as const;

type Feature = {
  icon: JSX.Element;
  title: string;
  content: string;
};

type Section = {
  title: string;
  heading: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 p-0 text-white drop-shadow-md">
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
    title: "Keyboard navigation & A11y",
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

const sections: Section[] = [];

function FeatureCard({ feature: f }: { feature: Feature }) {
  return (
    <div className="flex flex-col items-start gap-3.5 rounded-lg border-2 border-transparent bg-gray-100 px-6 pt-6 pb-8 drop-shadow-md transition-colors hover:border-blue-600 hover:bg-gray-50">
      {/* Icon */}
      {f.icon}
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
      {/* Content */}
      <p className="text-gray-600">{f.content}</p>
    </div>
  );
}

function Section({
  section: s,
  children,
}: {
  section: Section;
  children: React.ReactNode;
}) {
  return (
    <section id={s.title.toLowerCase()} className="w-full bg-white py-20">
      <div className="mx-auto space-y-3 px-4 md:w-[90%] md:max-w-[1200px]">
        <h2 className="font-semibold text-blue-600">{s.title}</h2>
        <p className="text-4xl font-extrabold text-gray-950">{s.heading}</p>
        <p className="max-w-3xl text-gray-600">{s.description}</p>
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
    <div>
      <a
        className="relative mx-auto flex w-20 items-center justify-center transition-all hover:scale-110"
        target="_blank"
        rel="noreferrer noopener"
        href={link}
      >
        <img
          className={`peer z-10 h-20 w-20 object-contain drop-shadow-lg ${
            rounded ? "rounded-3xl" : ""
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
      <span className="hidden text-2xl font-medium text-gray-600 dark:text-gray-200 md:block">
        LuccaNotes
      </span>
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div>
      <main className="flex flex-grow flex-col bg-gray-200 pt-0">
        {/* Hero section */}
        <section
          id="hero"
          className="relative w-full border-b-2 border-b-gray-200 bg-gray-100"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Navbar with transparent background */}
          <Navbar bgTransparent />

          {/* Title */}
          <h1 className="mt-16 text-center text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
            The open-source note-taking app <br /> for Markdown lovers 💙
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-4xl text-center text-lg text-gray-600">
            A no-frills web app for all your Markdown note-taking needs,
            laser-focused on productivity and unobtrusive UX. Powered by awesome
            open-source tech.
          </p>

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

          {/* Hero image */}
          <img
            className="mx-auto mt-16 mb-10 max-w-6xl rounded-lg border-2 border-gray-200 drop-shadow-2xl"
            src="/images/notes-light.png"
            alt="A preview of the main dashboard for LuccaNotes"
          />
          {/* <img className="shadow-lg" src="/images/editor-light.png" alt="" /> */}
        </section>

        {/* Features section */}
        <section id="features" className="w-full bg-white py-16">
          <div className="mx-auto space-y-3 px-4 md:w-[90%] md:max-w-[1200px]">
            {/* Title */}
            <h2 className="font-semibold text-blue-600">Features</h2>

            {/* Heading */}
            <p className="text-4xl font-extrabold text-gray-950">
              Just the essentials
            </p>

            {/* Description */}
            <p className="max-w-3xl text-gray-600">
              LuccaNotes ships with a sleek, yet minimal UI and a condensed
              feature set to help you avoid distractions and maximize your
              note-taking productivity.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-7 pt-12">
              {features.map((f, index) => (
                <FeatureCard key={index} feature={f} />
              ))}
            </div>
          </div>
        </section>

        {/* Technologies section */}
        <section id="technologies" className="w-full bg-white py-16">
          <div className="mx-auto space-y-3 px-4 md:w-[90%] md:max-w-[1200px]">
            {/* Title */}
            <h2 className="font-semibold text-blue-600">Technologies</h2>

            {/* Title */}
            <p className="text-4xl font-extrabold text-gray-950">
              Built with awesome open-source tech
            </p>

            {/* Description */}
            <p className="max-w-3xl text-gray-600">
              Huge thanks to the amazing people who build and maintain the
              programming languages, libraries, frameworks, databases, tooling,
              and platforms that power LuccaNotes. Go check them out!
            </p>

            {/* Logos */}
            <div className="grid grid-cols-8 items-stretch gap-x-8 gap-y-10 pt-12">
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
          </div>
        </section>

        {/* CTA section */}
        <section id="cta" className="w-full bg-white py-16">
          <div className="mx-auto space-y-3 px-4 md:w-[90%] md:max-w-[1200px]">
            <h2 className="font-semibold text-blue-600">Get started</h2>
            <p className="text-4xl font-extrabold text-gray-950">
              Ready to start taking notes?
            </p>
            <p className="max-w-3xl text-gray-600">
              Sign in with your favorite social login provider, create a new
              note and start writing right away — no registration, no fluff,
              nothing. Okay, maybe add a tag or two for tidiness&apos; sake, but
              that&apos;s up to you :-)
            </p>

            <div className="pt-4 pb-12">
              <Button
                intent="primary"
                label="Sign in"
                tooltipAlignment="xCenter"
                tooltipPosition="bottom"
                icon="sign-in"
                reverse
                size="rectangle"
                onClick={() =>
                  void signIn(undefined, { callbackUrl: "/notes" })
                }
                shadow
              />
            </div>

            <img
              className="mx-auto mb-10 mt-16 max-w-6xl rounded-lg border-2 border-gray-200 drop-shadow-xl"
              src="/images/editor-light.png"
              alt="A preview of the main dashboard for LuccaNotes"
            />
          </div>
        </section>

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
