import { Note, Tag } from "@prisma/client";
import { NoteWithTags } from "..";
import { formatDate } from "../utils/dates";
import Button from "./Button";
import TagPill from "./TagPill";
import Tooltip from "./Tooltip";

function HiddenTagPillContainer({
  hiddenTags,
  flipTags,
}: {
  hiddenTags: Tag[];
  flipTags: boolean;
}) {
  return (
    <>
      {/* Mobile */}
      <div className="relative block md:hidden">
        <p className="peer cursor-pointer text-gray-600 underline decoration-gray-600 decoration-1 hover:text-gray-900 hover:decoration-gray-900 dark:text-gray-400 dark:decoration-gray-400 dark:hover:text-gray-200 dark:hover:decoration-gray-200">
          {hiddenTags.length} more {hiddenTags.length === 1 ? "tag" : "tags"}
        </p>
        <Tooltip
          tooltipPosition={flipTags ? "top" : "bottom"}
          alignment="xCenter"
        >
          <div className="flex flex-col gap-2 md:flex-row">
            {hiddenTags.map((tag, index) => (
              <TagPill key={index} label={tag.label} color={tag.color} />
            ))}
          </div>
        </Tooltip>
      </div>
      {/* Desktop */}
      <div className="relative hidden md:block">
        <p className="peer cursor-pointer text-gray-600 underline decoration-gray-600 decoration-1 hover:text-gray-900 hover:decoration-gray-900 dark:text-gray-400 dark:decoration-gray-400 dark:hover:text-gray-200 dark:hover:decoration-gray-200">
          {hiddenTags.length} more {hiddenTags.length === 1 ? "tag" : "tags"}
        </p>
        <Tooltip tooltipPosition="bottom" alignment="xCenter">
          <div className="flex flex-col gap-2 md:flex-row">
            {hiddenTags.map((tag, index) => (
              <TagPill key={index} label={tag.label} color={tag.color} />
            ))}
          </div>
        </Tooltip>
      </div>
    </>
  );
}

function TagPillContainer({
  tags,
  flipTags = false,
}: {
  tags: Tag[];
  flipTags: boolean;
}) {
  return (
    <>
      {/* Mobile Tag container */}
      <div className="flex w-auto items-center gap-3 md:hidden">
        {tags[0] && <TagPill label={tags[0].label} color={tags[0].color} />}
        {tags.length - 1 > 0 && (
          <HiddenTagPillContainer
            flipTags={flipTags}
            hiddenTags={tags.slice(1, tags.length)}
          />
        )}
        {tags.length === 0 && (
          <span className="text-gray-500">No tags for this note yet!</span>
        )}
      </div>
      {/* Desktop Tag container */}
      <div className="hidden w-auto items-center gap-3 md:flex">
        {tags[0] && <TagPill label={tags[0].label} color={tags[0].color} />}
        {tags[1] && <TagPill label={tags[1].label} color={tags[1].color} />}
        {tags.length - 2 > 0 && (
          <HiddenTagPillContainer
            flipTags={flipTags}
            hiddenTags={tags.slice(2, tags.length)}
          />
        )}
        {tags.length === 0 && (
          <span className="text-gray-500">No tags for this note yet!</span>
        )}
      </div>
    </>
  );
}

function NoteCard({
  note,
  flipTags = false,
  setSelectedNoteId,
  dateType = "lastUpdated",
}: {
  note: NoteWithTags;
  flipTags?: boolean;
  setSelectedNoteId: (newSelectedNoteId: string) => void;
  dateType?: "lastUpdated" | "createdAt";
}) {
  return (
    <div className="group flex items-start justify-between rounded-lg border-2 border-transparent bg-white px-5 py-6 transition-[border-color] focus-within:border-blue-600 hover:border-blue-600 dark:bg-gray-950 md:px-7">
      <div className="flex flex-col">
        {/* Note title */}
        <h2 className="text-2xl font-semibold text-gray-900 underline decoration-transparent transition-[text-decoration-color] group-hover:decoration-gray-900 dark:text-white dark:group-focus-within:decoration-white dark:group-hover:decoration-white dark:group-focus-visible:decoration-white">
          {note.title}
        </h2>
        {/* Last updated */}
        {dateType === "lastUpdated" ? (
          <p className="pt-2 pb-3 text-gray-500">
            Last edited {formatDate(note.lastUpdated)}
          </p>
        ) : (
          <p className="pt-2 pb-3 text-gray-500">
            Created {formatDate(note.createdAt)}
          </p>
        )}

        <TagPillContainer flipTags={flipTags} tags={note.tags} />
      </div>
      <div className="mt-0 flex flex-col items-center gap-1 transition-all group-hover:opacity-100">
        <Button
          intent="secondary"
          label="Open note"
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          icon="arrow-square-out"
          iconOnly
          size="regular"
          href={`/notes/${note.id}`}
        />
        <Button
          intent="secondary"
          label="Options"
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          icon="three-dots"
          iconOnly
          size="regular"
          onClick={() => setSelectedNoteId(note.id)}
        />
      </div>
    </div>
  );
}

export default NoteCard;
