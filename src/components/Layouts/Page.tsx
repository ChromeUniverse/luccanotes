import React from "react";
import Navbar from "../Navbar";

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar username="lucca.dr" />
      <main className=" flex-grow bg-gray-200 pt-4 pb-20">
        <div className="mx-auto px-4 md:w-[90%] md:max-w-[1200px]">
          {children}
        </div>
      </main>
    </div>
  );
}

export default PageLayout;
