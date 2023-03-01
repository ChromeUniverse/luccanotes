import { Color } from "@prisma/client";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner, X } from "phosphor-react";
import Tooltip from "./Tooltip";

const tagPillStyles = cva("py-1 px-4 rounded-full select-none", {
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
    deletable: {
      true: "rounded-r-none",
    },
    dark: {
      true: "brightness-75 opacity-75 dark:brightness-50",
    },
  },
  defaultVariants: {
    deletable: false,
    dark: false,
  },
});

type TagPillProps = {
  label: string;
  onClickDelete?: (onClickDeleteProps: any) => void;
  loading?: boolean;
  destructive?: boolean;
};

type TagPillVariantProps = VariantProps<typeof tagPillStyles>;
export type TagColor = NonNullable<TagPillVariantProps["color"]>;
interface Props extends TagPillProps, TagPillVariantProps {}

// type TagPillVariantProps = VariantProps<typeof tagPillStyles>;
// export type TagColor = NonNullable<TagPillVariantProps["color"]>;
// type ProcessedVariantProps =
//   | Omit<TagPillVariantProps, "deletable">
//   | (Required<TagPillVariantProps> & {
//       onClickDelete: (onClickDeleteProps: any) => void;
//     });
// // interface Props extends TagPillProps, Omit<TagPillVariantProps, "deletable"> {}
// interface Props extends TagPillProps, ProcessedVariantProps {}

export const tagColorNames: Record<Color, string> = {
  sky: "Sky",
  red: "Red",
  green: "Green",
  violet: "Violet",
  yellow: "Yellow",
  lightGray: "Light Gray",
  darkGray: "Dark Gray",
} as const;

function TagPill({
  label,
  color,
  deletable,
  onClickDelete,
  loading = false,
  destructive = false,
  dark,
}: Props) {
  return (
    <div className="flex">
      <div className={tagPillStyles({ color, deletable, dark })}>{label}</div>
      {deletable && (
        <div className="relative">
          <button
            className="group peer flex h-full items-center justify-center rounded-r-full bg-gray-200 pl-1 pr-2.5 dark:bg-gray-800"
            onClick={onClickDelete}
            disabled={loading}
          >
            {loading ? (
              <Spinner
                className="animate-spin text-gray-400"
                weight="bold"
                size="18"
              />
            ) : (
              <X
                className="text-gray-400 group-hover:text-gray-600 group-focus:text-gray-600 dark:group-hover:text-gray-200 dark:group-focus:text-gray-200"
                weight="bold"
                size="18"
              />
            )}
          </button>
          {!loading && (
            <Tooltip tooltipPosition="bottom" alignment="xCenter">
              <span>{destructive ? "Delete tag" : "Remove tag"}</span>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}

export default TagPill;
