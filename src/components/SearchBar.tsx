import { CaretDown, MagnifyingGlass } from "phosphor-react";
import { useState } from "react";

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="flex w-full items-center rounded-lg bg-white py-2.5 px-5">
      <MagnifyingGlass className="text-gray-400" size={20} weight="bold" />

      <input
        className="font-lg mx-4 w-full text-gray-900 outline-none placeholder:text-gray-400"
        type="text"
        placeholder="Search notes by title..."
      />
      <CaretDown className="ml-auto text-gray-400" size={20} weight="bold" />
    </div>
  );
}

export default SearchBar;
