// React, Next, Zustand
import React, { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import useThemeStore from "../stores/theme";

// Components
import { Listbox, Popover, Transition } from "@headlessui/react";
import {
  BookBookmark,
  Gear,
  Info,
  Moon,
  Palette,
  SignOut,
  Sun,
} from "phosphor-react";
import CaretUpDownIcon from "./CaretUpDownIcon";
import Button from "./Button";
import Image from "next/image";

function ThemeOption({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="flex items-center gap-3 pl-2">
      {theme === "light" && <Sun size={18} weight="bold" />}
      {theme === "dark" && <Moon size={18} weight="bold" />}
      <span>{theme === "light" ? "Light" : "Dark"}</span>
    </div>
  );
}

function Slash() {
  return <span className="text-3xl text-gray-400 dark:text-gray-700">/</span>;
}

function DropdownLine({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: (onClickProps: unknown) => void;
}) {
  const className =
    "flex items-center gap-3 px-6 py-1.5 hover:bg-gray-200 hover:bg-opacity-50 dark:hover:bg-gray-700";
  return onClick ? (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  );
}

function Logo({ session }: { session?: Session }) {
  return (
    <Link className="flex items-center gap-3" href={session ? "/notes" : "/"}>
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
        <BookBookmark color="white" size={28} />
      </div>
      {/* App Name */}
      {/* {session && ( */}
      <span className="hidden text-xl font-medium text-gray-600 dark:text-gray-200 md:block">
        LuccaNotes
      </span>
      {/* )} */}
    </Link>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();
  return (
    <Listbox
      as="div"
      value={theme}
      onChange={setTheme}
      className="relative ml-auto"
    >
      {/* Button */}
      <Listbox.Button className="flex w-24 items-center justify-between gap-4 whitespace-nowrap rounded-lg bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-850">
        {theme === "light" ? "Light" : "Dark"}
        <CaretUpDownIcon />
      </Listbox.Button>

      {/* Options */}
      <Listbox.Options className="absolute right-0 top-full z-20 mt-1 w-28 items-center rounded-lg border-2 border-transparent border-gray-400 bg-gray-200 py-2 drop-shadow-lg dark:border-gray-950 dark:bg-gray-850">
        {/* Light option */}
        <Listbox.Option
          className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600 dark:text-gray-100 dark:ui-active:bg-blue-900 dark:ui-active:bg-opacity-60 "
          value="light"
        >
          <ThemeOption theme="light" />
        </Listbox.Option>
        {/* Dark option */}
        <Listbox.Option
          className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600 dark:text-gray-100 dark:ui-active:bg-blue-900 dark:ui-active:bg-opacity-60 "
          value="dark"
        >
          <ThemeOption theme="dark" />
        </Listbox.Option>
      </Listbox.Options>
    </Listbox>
  );
}

function PfpDropdown({ session }: { session: Session }) {
  return (
    <Popover className="relative ml-auto flex items-center">
      {/* PFP button */}
      <Popover.Button className="rounded-full outline-2 hover:outline-blue-600 focus:border-transparent focus:outline-blue-600 focus:ring-0 ui-open:outline-blue-600">
        <img
          alt="profile picture"
          src={session.user.image as string}
          className="ml-auto h-12 w-12 rounded-full bg-slate-300"
          referrerPolicy="no-referrer"
        />
      </Popover.Button>

      {/* Dropdown menu */}
      <Transition
        enter="transition ease-out z-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-out z-10"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute top-full right-0 z-10 mt-3 flex w-72 flex-col rounded-lg bg-gray-100 py-2 text-gray-600 drop-shadow-lg dark:bg-gray-800 dark:text-gray-100">
          {/* Account settings */}
          {/* <DropdownLine>
            <Gear //
              className="text-gray-400 dark:text-gray-500"
              size={24}
              weight="regular"
            />
            <span>Account settings</span>
          </DropdownLine> */}
          {/* Theme Selector */}
          <DropdownLine>
            <Palette //
              className="text-gray-400 dark:text-gray-500"
              size={24}
              weight="regular"
            />
            <span>Theme</span>
            <ThemeSelector />
          </DropdownLine>

          {/* About/more info */}
          {/* <DropdownLine>
            <Info //
              className="text-gray-400 dark:text-gray-500"
              size={24}
              weight="regular"
            />
            <span>About</span>
          </DropdownLine> */}
          {/* Logout */}
          <hr className="my-1 h-[2px] border-none bg-gray-300 dark:bg-gray-700"></hr>
          <DropdownLine onClick={() => void signOut({ callbackUrl: "/" })}>
            <SignOut //
              className="text-gray-400 dark:text-gray-500"
              size={24}
              weight="regular"
            />
            <span>Log out</span>
          </DropdownLine>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

function Navbar({
  bgTransparent,
  noteTitle,
  session,
}: {
  bgTransparent?: boolean;
  noteTitle?: string;
  session?: Session;
}) {
  return (
    <nav
      className={`
      flex items-center gap-2 bg-white py-3 px-4 dark:bg-gray-950 md:px-8
      ${bgTransparent ? "bg-transparent" : ""}
    `}
    >
      <Logo session={session} />
      {session ? (
        <>
          {/* Desktop */}
          <div className="hidden items-center gap-2 md:flex">
            <Slash />

            {/* Username */}
            <span className="text-xl text-gray-700 dark:text-gray-300">
              {session.user.name}
            </span>

            {/* Note title */}
            {noteTitle && (
              <>
                <Slash />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {noteTitle}
                </span>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            {noteTitle ? (
              <>
                <Slash />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {noteTitle}
                </span>
              </>
            ) : (
              <>
                <Slash />
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  {session.user.name}
                </span>
              </>
            )}
          </div>

          {/* Profile Picture */}
          <PfpDropdown session={session} />
        </>
      ) : (
        <div className="ml-auto flex items-center gap-8">
          {/* Nav links */}
          <a
            className="hidden text-base font-semibold text-gray-600 hover:text-blue-600 md:block" //
            href="#features"
          >
            Features
          </a>
          <a
            className="hidden text-base font-semibold text-gray-600 hover:text-blue-600 md:block" //
            href="#technologies"
          >
            Tech
          </a>
          <a
            className="hidden text-base font-semibold text-gray-600 hover:text-blue-600 md:block" //
            href="#cta"
          >
            Get started
          </a>

          <Button
            intent="primary"
            label="Sign in"
            tooltipAlignment="xCenter"
            tooltipPosition="bottom"
            icon="sign-in"
            reverse
            size="rectangle"
            onClick={() => void signIn(undefined, { callbackUrl: "/notes" })}
          />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
