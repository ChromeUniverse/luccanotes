import React from "react";
import Navbar from "../Navbar";

function PageLayout({
  container = false,
  noteTitle,
  children,
}: {
  container?: boolean;
  noteTitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar username="lucca.dr" noteTitle={noteTitle} />
      {container ? (
        <main className="flex-grow bg-gray-200 pt-4 pb-20 dark:bg-gray-900">
          <div className="mx-auto px-4 md:w-[90%] md:max-w-[1200px]">
            {children}
          </div>
        </main>
      ) : (
        <main className="flex flex-grow bg-gray-200 pt-0">{children}</main>
      )}
    </div>
  );
}

export default PageLayout;
