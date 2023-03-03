import { type GetServerSidePropsContext, type NextPage } from "next";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import PageLayout from "../components/Layouts/Page";
import { getServerAuthSession } from "../server/auth";

// Phosphor and FontAwesome icons
import {
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
    title: "GitHub-flavored Markdown",
    content:
      "Tailwind automatically removes all unused CSS when building for production, which means your final CSS bundle is the smallest it could possibly be.",
  },
  {
    icon: <FloppyDisk {...iconProps} />,
    title: "Auto-saving",
    content:
      "Tailwind automatically removes all unused CSS when building for production, which means your final CSS bundle is the smallest it could possibly be.",
  },
  {
    icon: <Tag {...iconProps} />,
    title: "Organize with Tags",
    content:
      "Tailwind automatically removes all unused CSS when building for production, which means your final CSS bundle is the smallest it could possibly be.",
  },
  {
    icon: <Eye {...iconProps} />,
    title: "Note previews",
    content:
      "Tailwind automatically removes all unused CSS when building for production, which means your final CSS bundle is the smallest it could possibly be.",
  },
  {
    icon: <Keyboard {...iconProps} />,
    title: "Keyboard navigation",
    content:
      "Tailwind automatically removes all unused CSS when building for production, which means your final CSS bundle is the smallest it could possibly be.",
  },
  {
    icon: <MagnifyingGlass {...iconProps} />,
    title: "Sorting & Filtering",
    content:
      "Tailwind automatically removes all unused CSS when building for production, which means your final CSS bundle is the smallest it could possibly be.",
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
          className={`peer z-10 h-20 w-20 object-contain ${
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

const Home: NextPage = () => {
  return (
    <PageLayout>
      {/* style={{
            // backgroundColor: "#5a3296",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} */}

      {/* Hero section */}
      <section
        id="hero"
        className="relative w-full bg-gray-100 pt-10"
        style={{
          // backgroundColor: "#5a3296",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Title */}
        <h1 className="mt-6 text-center text-5xl font-extrabold leading-tight tracking-tight text-gray-950">
          The open-source note-taking app <br /> for Markdown Lovers 💙
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-gray-600">
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
          className="mx-auto mt-16 mb-10 w-[70%] rounded-lg drop-shadow-2xl"
          src="/images/notes-light.png"
          alt="A preview of the main dashboard for LuccaNotes"
        />
        {/* <img className="shadow-lg" src="/images/editor-light.png" alt="" /> */}
      </section>

      {/* Features section */}
      <section id="features" className="w-full bg-white py-20">
        <div className="mx-auto space-y-3 px-4 md:w-[90%] md:max-w-[1200px]">
          {/* Title */}
          <h2 className="font-semibold text-blue-600">Features</h2>

          {/* Heading */}
          <p className="text-4xl font-extrabold text-gray-950">
            Just the essentials, and nothing more
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
      <section id="features" className="w-full bg-white py-20">
        <div className="mx-auto space-y-3 px-4 md:w-[90%] md:max-w-[1200px]">
          {/* Title */}
          <h2 className="font-semibold text-blue-600">Technologies</h2>

          {/* Title */}
          <p className="text-4xl font-extrabold text-gray-950">
            Built with awesome open-source technology
          </p>

          {/* Description */}
          <p className="max-w-3xl text-gray-600">
            Huge thanks to the amazing people who build and maintain the
            programming languages, libraries, frameworks, databases, tooling,
            and platforms that power LuccaNotes. Go check them out!
          </p>

          {/* Logos */}
          <div className="grid grid-cols-8 items-stretch gap-x-8 gap-y-10 pt-10">
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
              label="NextAuth"
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
              // src="https://www.drupal.org/files/project-images/font_awesome_logo.png"
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
    </PageLayout>
  );
};

export default Home;
