import { cva, VariantProps } from "class-variance-authority";
import {
  ArrowSquareOut,
  DotsThreeOutlineVertical,
  IconProps,
  NotePencil,
  Tag,
} from "phosphor-react";
import React from "react";
import Tooltip, { TooltipPosition } from "./Tooltip";

// CVA Variants
const buttonStyles = cva("peer flex items-center justify-center", {
  variants: {
    intent: {
      primary: "bg-blue-600 text-white hover:brightness-[85%]",
      secondary: "bg-white text-gray-400 hover:brightness-95",
    },
    roundedFull: {
      true: "rounded-[28px] hover:rounded-xl transition-all",
      false: "rounded-lg",
    },
    shadow: {
      true: "drop-shadow-lg",
    },
    lg: {
      true: "w-14 h-14",
      false: "w-10 h-10",
    },
  },
  defaultVariants: {
    roundedFull: false,
    shadow: false,
    lg: false,
  },
});

// Base Button Props
type ButtonProps = {
  icon?: "note-pencil" | "tag" | "arrow-square-out" | "three-dots";
  label: string;
  tooltipPosition: TooltipPosition;
};

// Merged props
type buttonVariantsProps = VariantProps<typeof buttonStyles>;
interface Props
  extends ButtonProps,
    Omit<buttonVariantsProps, "intent">,
    Required<Pick<buttonVariantsProps, "intent">> {}

// Icons and styling props
const IconProps: IconProps = { size: 28, weight: "bold" };
const icons = {
  "note-pencil": <NotePencil size={28} weight="bold" />,
  tag: <Tag size={28} weight="bold" />,
  "arrow-square-out": <ArrowSquareOut size={24} weight="bold" />,
  "three-dots": <DotsThreeOutlineVertical size={24} weight="fill" />,
} as const;

function Button({
  icon,
  label,
  roundedFull,
  intent,
  tooltipPosition,
  shadow,
  lg,
}: Props) {
  return (
    <div className="relative">
      <button className={buttonStyles({ intent, roundedFull, shadow, lg })}>
        {/* {icon === "note-pencil" && <NotePencil {...IconProps} />} */}
        {/* {icon === "tag" && <Tag {...IconProps} />} */}
        {icon && icons[icon]}
      </button>
      <Tooltip tooltipPosition={tooltipPosition}>{label}</Tooltip>
    </div>
  );
}

export default Button;
