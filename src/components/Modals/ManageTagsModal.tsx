import { Dialog, Listbox } from "@headlessui/react";
import { Check } from "phosphor-react";
import { useState } from "react";
import Button from "../Button";
import CaretUpDownIcon from "../CaretUpDownIcon";
import TagPill, { type TagColor, type Tag, tagColorNames } from "../TagPill";

function ManageTagsModal({
  open,
  onClose,
  tags,
  createNewTag,
  deleteTag,
}: {
  open: boolean;
  onClose: (newOpen: boolean) => void;
  tags: Tag[];
  createNewTag: ({
    newTagLabel,
    newTagColor,
  }: {
    newTagLabel: string;
    newTagColor: TagColor;
  }) => void;
  deleteTag: (targetId: string) => void;
}) {
  // modal state
  const [newTagLabel, setNewTagLabel] = useState<string>("");
  const [newTagColor, setNewTagColor] = useState<TagColor>("sky");

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-25">
        <Dialog.Panel className="w-[90%] space-y-6 rounded-lg bg-white px-6 py-6 md:w-[500px] md:px-10">
          <Dialog.Title className="text-2xl font-semibold text-gray-900">
            Manage Tags
          </Dialog.Title>
          <Dialog.Description className="hidden">
            This dialog allows you to manage your tags
          </Dialog.Description>

          {/* Tags containers */}
          <h3 className="text-xl font-normal text-gray-600">All tags</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(tags).map((tag) => (
              <TagPill
                key={tag.id}
                label={tag.label}
                color={tag.color}
                deletable
                onClickDelete={() => deleteTag(tag.id)}
              />
            ))}
          </div>

          {/* Create new tag */}
          <h3 className="text-xl font-normal text-gray-600">Create new tag</h3>

          <div className="flex flex-col gap-2 md:flex-row">
            {/* New tag label input */}
            <input
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 outline-gray-500 placeholder:text-gray-400"
              placeholder="New tag label here..."
              type="text"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
            />

            {/* New tag color selector */}
            <div className="flex justify-between gap-2">
              <Listbox
                as="div"
                value={newTagColor}
                onChange={setNewTagColor}
                className="relative"
              >
                {/* Button */}
                <Listbox.Button className="flex w-36 items-center justify-between gap-4 whitespace-nowrap rounded-lg border-2 bg-gray-200 px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100">
                  {tagColorNames[newTagColor]}
                  <CaretUpDownIcon />
                </Listbox.Button>

                {/* Options */}
                <Listbox.Options className="absolute right-0 bottom-full z-20 mb-2 w-full items-center rounded-lg bg-gray-200 py-2 drop-shadow-lg">
                  {/* Light option */}
                  {Object.keys(tagColorNames).map((color, index) => (
                    <Listbox.Option
                      key={index}
                      className="flex items-center whitespace-nowrap py-1 pl-2 pr-6 text-gray-900 ui-active:bg-blue-200 ui-active:text-blue-600"
                      value={color}
                    >
                      <Check
                        weight="bold"
                        size={20}
                        className="ml-1 mr-2 text-blue-500 opacity-0 ui-selected:opacity-100 ui-active:text-blue-600"
                      />
                      {tagColorNames[color as TagColor]}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>

              <div className="hidden md:block">
                <Button
                  icon="plus"
                  intent="primary"
                  label="Create tag"
                  tooltipPosition="bottom"
                  tooltipAlignment="xCenter"
                  onClick={() => {
                    setNewTagLabel("");
                    createNewTag({ newTagColor, newTagLabel });
                  }}
                  iconOnly
                  size="regular"
                />
              </div>

              <div className="block md:hidden">
                <Button
                  icon="plus"
                  intent="primary"
                  label="Create tag"
                  tooltipPosition="bottom"
                  tooltipAlignment="xCenter"
                  onClick={() => {
                    setNewTagLabel("");
                    createNewTag({ newTagColor, newTagLabel });
                  }}
                  size="rectangle"
                  reverse
                />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ManageTagsModal;
