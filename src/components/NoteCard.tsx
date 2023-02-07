import Button from "./Button";
import TagPill, { type Tag } from "./TagPill";
import Tooltip from "./Tooltip";

function HiddenTagPillContainer({ hiddenTags }: { hiddenTags: Tag[] }) {
  return (
    <div className="relative">
      <p className="peer cursor-pointer text-gray-600 underline decoration-gray-600 decoration-1 hover:text-gray-900">
        {hiddenTags.length} more {hiddenTags.length === 1 ? "tag" : "tags"}
      </p>
      <Tooltip tooltipPosition="bottom">
        <div className="flex flex-col gap-2 md:flex-row">
          {hiddenTags.map((tag, index) => (
            <TagPill key={index} label={tag.label} color={tag.color} />
          ))}
        </div>
      </Tooltip>
    </div>
  );
}

function TagPillContainer({ tags }: { tags: Tag[] }) {
  return (
    <>
      {/* Mobile Tag container */}
      <div className="flex w-auto items-center gap-3 md:hidden">
        {tags[0] && <TagPill label={tags[0].label} color={tags[0].color} />}
        {tags.length - 1 > 0 && (
          <HiddenTagPillContainer hiddenTags={tags.slice(1, tags.length)} />
        )}
      </div>
      {/* Desktop Tag container */}
      <div className="hidden w-auto items-center gap-3 md:flex">
        {tags[0] && <TagPill label={tags[0].label} color={tags[0].color} />}
        {tags[1] && <TagPill label={tags[1].label} color={tags[1].color} />}
        {tags.length - 2 > 0 && (
          <HiddenTagPillContainer hiddenTags={tags.slice(2, tags.length)} />
        )}
      </div>
    </>
  );
}

function NoteCard({
  title,
  lastUpdated,
  tags,
}: {
  title: string;
  lastUpdated: Date;
  tags: Tag[];
}) {
  return (
    <div className="group flex items-start justify-between rounded-lg border-2 border-transparent bg-white px-5 py-6 transition-colors focus-within:border-blue-600 hover:border-blue-600 md:px-7">
      <div className="flex flex-col">
        {/* Note title */}
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {/* Last updated */}
        <p className="pt-2 pb-3 text-gray-500">
          {/* Last edited {Date.now() - lastUpdated.getTime()} ms ago */}
          {/* WARNING: Dirty hack to avoid hydration errors */}
          Just testing
        </p>
        <TagPillContainer tags={tags} />
      </div>
      <div className="mt-0 flex flex-col items-center gap-1 transition-all group-hover:opacity-100">
        <Button
          intent="secondary"
          label="Open note"
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          icon="arrow-square-out"
        />
        <Button
          intent="secondary"
          label="Options"
          tooltipPosition="left"
          tooltipAlignment="yCenter"
          icon="three-dots"
        />
      </div>
    </div>
  );
}

export default NoteCard;
