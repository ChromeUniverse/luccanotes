import { Listbox, Popover, RadioGroup, Transition } from "@headlessui/react";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
} from "phosphor-react";
import { useState } from "react";
import { Tag } from "..";
import Button from "./Button";
import TagPill from "./TagPill";
import Tooltip from "./Tooltip";

// Sort fields
const sortFieldLabels = {
  title: "Title",
  createdAt: "Creation Date",
  lastUpdated: "Last Updated",
} as const;
type SortField = keyof typeof sortFieldLabels;

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
    <div className="space-y-2">
      <h3 className="mb-0 text-lg font-semibold text-gray-900">Sorting</h3>
      <div className="flex flex-row gap-10">
        {/* Sort Field Selector */}
        <div className="flex items-center gap-3">
          {/* Label */}
          <span className="text-gray-600">Sort by</span>
          <Listbox
            as="div"
            value={sortField}
            onChange={setSortField}
            className="relative"
          >
            {/* Button */}
            <Listbox.Button className="flex w-44 items-center justify-between gap-4 whitespace-nowrap rounded-lg border-2 bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100">
              {sortFieldLabels[sortField]}
              <CaretUpDownIcon />
            </Listbox.Button>

            {/* Dropdown menu */}
            <Listbox.Options className="absolute left-0 top-full z-20 mt-1 rounded-lg bg-gray-200 py-2 drop-shadow-lg">
              {Object.keys(sortFieldLabels).map((sortFieldOption, index) => (
                <Listbox.Option
                  className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600"
                  key={index}
                  value={sortFieldOption}
                >
                  <Check
                    weight="bold"
                    size={20}
                    className="ml-1 mr-2 text-blue-500 opacity-0 ui-selected:opacity-100 ui-active:text-blue-600"
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
          className="mr-6 flex items-center gap-3"
          value={sortOrder}
          onChange={setSortOrder}
        >
          {/* Label */}
          <RadioGroup.Label className="text-gray-600">Order</RadioGroup.Label>
          {/* Options */}
          <div className="flex">
            <RadioGroup.Option value="asc">
              <ArrowCircleUp
                weight="duotone"
                size={40}
                className="cursor-pointer fill-transparent text-gray-400 transition-all ui-checked:fill-blue-500 ui-checked:text-blue-600"
              />
            </RadioGroup.Option>
            <RadioGroup.Option value="desc">
              <ArrowCircleDown
                weight="duotone"
                size={40}
                className="cursor-pointer fill-transparent text-gray-400 transition-all ui-checked:fill-blue-500 ui-checked:text-blue-600"
              />
            </RadioGroup.Option>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function TagsSection({ tags }: { tags: Tag[] }) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-semibold text-gray-900">Tags</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <TagPill key={index} label={tag.label} color={tag.color} />
        ))}
      </div>
    </div>
  );
}

function CaretUpDownIcon() {
  return (
    <div className="flex flex-col">
      <CaretUp weight="bold" size={12} />
      <CaretDown weight="bold" size={12} />
    </div>
  );
}

function SearchBar({ tags }: { tags: Tag[] }) {
  // Search parameters state
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  return (
    <div className="relative flex w-full items-center rounded-lg bg-white pl-5 pr-3">
      <MagnifyingGlass className="text-gray-400" size={20} weight="bold" />
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="font-lg placeholder:text-gray- mx-4 w-full text-gray-900 outline-none"
        type="text"
        placeholder="Search notes by title..."
      />

      <Popover as="div" className="flex items-center justify-center">
        <Popover.Button as="div">
          {/* <Button
            intent="secondary"
            icon="caret-down"
            label="Sort & Filter"
            tooltipPosition="bottom"
          /> */}

          {({ open }) => (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-gray-100">
              <CaretDown
                className="peer text-gray-400 transition ui-open:rotate-180"
                size={20}
                weight="bold"
              />
              {!open && (
                <Tooltip tooltipPosition="bottom">Sorting & Filtering</Tooltip>
              )}
            </div>
          )}
        </Popover.Button>
        <Transition
        // enter="transition duration-100 ease-out "
        // enterFrom="opacity-0 scale-0"
        // enterTo="opacity-100 scale-100"
        // leave="transition duration-75 ease-out"
        // leaveFrom="transform scale-100 opacity-100"
        // leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel
            as="div"
            className="absolute right-0 left-0 top-full z-10 mt-3 flex origin-top-right flex-col gap-2 rounded-lg bg-gray-100 px-6 py-4 drop-shadow-lg"
          >
            <SortingSection
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            {/* Tags */}
            <TagsSection tags={tags} />
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}

export default SearchBar;
