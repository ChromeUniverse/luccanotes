import { Listbox, Popover, RadioGroup, Transition } from "@headlessui/react";
import { Tag } from "@prisma/client";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
} from "phosphor-react";
import { useState } from "react";
import Button from "./Button";
import CaretUpDownIcon from "./CaretUpDownIcon";
import TagPill from "./TagPill";
import Tooltip from "./Tooltip";

// Sort fields
const sortFieldLabels = {
  title: "Title",
  createdAt: "Creation Date",
  lastUpdated: "Last Updated",
} as const;
export type SortField = keyof typeof sortFieldLabels;

function SortingSection({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: {
  sortField: SortField;
  setSortField: (newSortField: SortField) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (newSortOrder: "asc" | "desc") => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="mb-0 text-lg font-semibold text-gray-900 dark:text-gray-300">
        Sorting
      </h3>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sort Field Selector */}
        <div className="flex items-center gap-3">
          {/* Label */}
          <span className="text-gray-600 dark:text-gray-400">Sort by</span>
          <Listbox
            as="div"
            value={sortField}
            onChange={setSortField}
            className="relative"
          >
            {/* Button */}
            <Listbox.Button className="flex w-44 items-center justify-between gap-4 whitespace-nowrap rounded-lg border-2 border-transparent  bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-850">
              {sortFieldLabels[sortField]}
              <CaretUpDownIcon />
            </Listbox.Button>

            {/* Dropdown menu */}
            <Listbox.Options className="absolute left-0 top-full z-20 mt-1 rounded-lg border-2 border-transparent border-gray-400 bg-gray-200 py-2 drop-shadow-lg dark:border-gray-950 dark:bg-gray-850">
              {Object.keys(sortFieldLabels).map((sortFieldOption, index) => (
                <Listbox.Option
                  className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600 dark:text-gray-100 dark:ui-active:bg-blue-900 dark:ui-active:bg-opacity-60"
                  key={index}
                  value={sortFieldOption}
                >
                  <Check
                    weight="bold"
                    size={20}
                    className="ml-1 mr-2 text-blue-500 opacity-0 ui-selected:opacity-100 ui-active:text-blue-600 dark:ui-active:text-blue-400"
                  />
                  {sortFieldLabels[sortFieldOption as SortField]}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>

        {/* Sort Order Selector */}
        <RadioGroup
          as="div"
          className="mr-6 flex items-center gap-2"
          value={sortOrder}
          onChange={setSortOrder}
        >
          {/* Label */}
          <RadioGroup.Label className="text-gray-600 dark:text-gray-400">
            Order
          </RadioGroup.Label>
          {/* Options */}
          {sortField === "title" ? (
            // sorting by title
            <div className="flex gap-3">
              <RadioGroup.Option value="asc">
                <span className="cursor-pointer rounded-lg border-2 border-transparent bg-gray-200 p-2.5 font-semibold text-gray-500 transition-colors ui-checked:border-blue-600 ui-checked:bg-blue-200 ui-checked:text-blue-600 dark:bg-gray-900">
                  A-z
                </span>
              </RadioGroup.Option>
              <RadioGroup.Option value="desc">
                <span className="cursor-pointer rounded-lg border-2 border-transparent bg-gray-200 p-2.5 font-semibold text-gray-500 transition-colors ui-checked:border-blue-600 ui-checked:bg-blue-200 ui-checked:text-blue-600 dark:bg-gray-900">
                  Z-a
                </span>
              </RadioGroup.Option>
            </div>
          ) : (
            // sorting by 'createdAt' or 'lastUpdate'
            <div className="flex">
              <RadioGroup.Option value="asc">
                <ArrowCircleUp
                  weight="duotone"
                  size={40}
                  className="cursor-pointer fill-transparent text-gray-400 transition-all ui-checked:fill-blue-500 ui-checked:text-blue-600 dark:text-gray-500 dark:ui-checked:fill-gray-950 dark:ui-checked:text-blue-600"
                />
              </RadioGroup.Option>
              <RadioGroup.Option value="desc">
                <ArrowCircleDown
                  weight="duotone"
                  size={40}
                  className="cursor-pointer fill-transparent text-gray-400 transition-all ui-checked:fill-blue-500 ui-checked:text-blue-600 dark:text-gray-500 dark:ui-checked:fill-gray-950 dark:ui-checked:text-blue-600"
                />
              </RadioGroup.Option>
            </div>
          )}
        </RadioGroup>
      </div>
    </div>
  );
}

function TagsSection({ tags }: { tags: Tag[] }) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-300">
        Tags
      </p>
      <div className="flex flex-wrap gap-1">
        {tags.map(({ id, label, color }, index) => (
          <TagPill key={id} label={label} color={color} />
        ))}
      </div>
    </div>
  );
}

function SearchBar({
  tags,
  searchInput,
  setSearchInput,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: {
  tags: Tag[];
  searchInput: string;
  setSearchInput: (newSearchInput: string) => void;
  sortField: SortField;
  setSortField: (newSortField: SortField) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (newSortOrder: "asc" | "desc") => void;
}) {
  return (
    <div className="relative flex w-full items-center rounded-lg border-2 border-transparent bg-white py-1.5 pl-5 pr-3 transition-[border-color] focus-within:border-blue-600 dark:bg-gray-950">
      <MagnifyingGlass className="text-gray-400" size={20} weight="bold" />
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="font-lg placeholder:text-gray- mx-4 w-full bg-transparent text-gray-900 outline-none dark:text-white"
        type="text"
        placeholder="Search notes by title..."
      />

      <Popover as="div" className="flex items-center justify-center">
        <Popover.Button className="group relative outline-none">
          {({ open }) => (
            <>
              {/* Desktop */}
              <div className="hidden md:block">
                <div className="peer h-10 w-10 items-center justify-center rounded-lg outline outline-2 outline-transparent transition-all hover:bg-gray-100 group-focus:bg-gray-100 group-focus:outline-gray-900 dark:hover:bg-gray-900 dark:hover:bg-gray-900 dark:group-focus:bg-gray-900 md:flex">
                  <CaretDown
                    className="text-gray-400 transition ui-open:rotate-180"
                    size={20}
                    weight="bold"
                  />
                </div>
                {!open && (
                  <Tooltip tooltipPosition="bottom" alignment="xCenter">
                    Sorting & Filtering
                  </Tooltip>
                )}
              </div>
              {/* Mobile */}
              <div className="block md:hidden">
                <div className="peer flex h-10 w-10 items-center justify-center rounded-lg outline outline-2 outline-transparent transition-all hover:bg-gray-100 group-focus:bg-gray-100 group-focus:outline-gray-900 dark:hover:bg-gray-900 dark:hover:bg-gray-900 dark:group-focus:bg-gray-900 md:hidden">
                  <CaretDown
                    className="text-gray-400 transition ui-open:rotate-180"
                    size={20}
                    weight="bold"
                  />
                </div>
                {!open && (
                  <Tooltip tooltipPosition="bottom" alignment="left">
                    Sorting & Filtering
                  </Tooltip>
                )}
              </div>
            </>
          )}
        </Popover.Button>
        <Transition
          enter="transition ease-out z-10"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-out z-10"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel className="absolute right-0 left-0 top-full z-10 mt-3 flex flex-col gap-5 rounded-lg bg-gray-100 px-6 py-4 drop-shadow-lg ui-open:scale-100 dark:bg-gray-800">
            <SortingSection
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            <TagsSection tags={tags} />
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}

export default SearchBar;
