import { BookBookmark } from "phosphor-react";

function Slash() {
  return <span className="text-3xl text-gray-400">/</span>;
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
        <BookBookmark color="white" size={28} />
      </div>
      {/* App Name */}
      <span className="hidden text-xl font-medium text-gray-600 md:block">
        LuccaNotes
      </span>
    </div>
  );
}

function Navbar({
  username,
  noteTitle,
}: {
  username: string;
  noteTitle: string;
}) {
  return (
    <nav className="flex items-center gap-2 bg-white py-3 px-4 md:px-8">
      <Logo />
      <Slash />
      {/* Username */}
      <span className="text-xl text-gray-700">{username}</span>
      {/* <Slash /> */}
      {/* Note title */}
      {/* <span className="gray-900 text-xl font-semibold">{noteTitle}</span> */}
      <div className="ml-auto h-12 w-12 rounded-full bg-slate-300"></div>
    </nav>
  );
}

export default Navbar;
