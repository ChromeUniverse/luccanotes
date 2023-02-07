import { cva, type VariantProps } from "class-variance-authority";

const tagPillStyles = cva("rounded-full py-1 px-4", {
  variants: {
    color: {
      sky: "bg-sky-200 text-sky-700",
      red: "bg-red-200 text-red-700",
      green: "bg-green-200 text-green-700",
      violet: "bg-violet-200 text-violet-700",
      yellow: "bg-yellow-200 text-yellow-700",
      lightGray: "bg-gray-300 text-gray-700",
      darkGray: "bg-gray-700 text-gray-300",
    },
  },
});

interface TagPillProps {
  label: string;
}

type TagColors = Required<VariantProps<typeof tagPillStyles>>["color"];

export type Tag = {
  label: string;
  color: TagColors;
};

interface Props
  extends TagPillProps,
    Required<VariantProps<typeof tagPillStyles>> {}

function TagPill({ label, color }: Props) {
  return <div className={tagPillStyles({ color })}>{label}</div>;
}

export default TagPill;
