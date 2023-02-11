import { cva, VariantProps } from "class-variance-authority";
import {
  ArrowSquareOut,
  CaretDown,
  DotsThreeOutlineVertical,
  IconProps,
  NotePencil,
  Plus,
  Tag,
} from "phosphor-react";
import React from "react";
import Tooltip, { TooltipAlignment, TooltipPosition } from "./Tooltip";

// CVA Variants
const buttonStyles = cva("peer flex items-center justify-center", {
  variants: {
    intent: {
      primary:
        "bg-blue-600 text-white hover:brightness-[85%] focus-visible:brightness-[85%]",
      secondary:
        "bg-white text-gray-400 hover:brightness-95 hover:text-blue-600 focus-visible:brightness-95 focus-visible:text-blue-600",
    },
    roundedFull: {
      true: "rounded-[28px] hover:rounded-xl transition-all",
      false: "rounded-lg",
    },
    shadow: {
      true: "drop-shadow-lg",
    },
    size: {
      lg: "w-14 h-14",
      regular: "w-10 h-10",
    },
  },
  defaultVariants: {
    roundedFull: false,
    shadow: false,
    size: "regular",
  },
});

type ButtonIconNames =
  | "note-pencil"
  | "tag"
  | "arrow-square-out"
  | "three-dots"
  | "caret-down"
  | "plus";

// Base Button Props
type ButtonProps = {
  icon?: ButtonIconNames;
  label: string;
  tooltipPosition: TooltipPosition;
  tooltipAlignment: TooltipAlignment;
  onClick?: (onClickProps: unknown) => void;
};

// Merged props
type buttonVariantsProps = VariantProps<typeof buttonStyles>;
interface Props
  extends ButtonProps,
    Omit<buttonVariantsProps, "intent">,
    Required<Pick<buttonVariantsProps, "intent">> {}

// Icons and styling props
// const IconProps: IconProps = { size: 28, weight: "bold" };
const icons: Record<ButtonIconNames, JSX.Element> = {
  "note-pencil": <NotePencil size={28} weight="bold" />,
  tag: <Tag size={28} weight="bold" />,
  "arrow-square-out": <ArrowSquareOut size={24} weight="bold" />,
  "three-dots": <DotsThreeOutlineVertical size={24} weight="fill" />,
  "caret-down": <CaretDown size={24} weight="bold" />,
  plus: <Plus size={24} weight="bold" />,
} as const;

function Button({
  icon,
  label,
  roundedFull,
  intent,
  tooltipPosition,
  tooltipAlignment,
  shadow,
  size,
  onClick,
}: Props) {
  return (
    <div className="relative">
      <button
        className={buttonStyles({ intent, roundedFull, shadow, size })}
        onClick={onClick}
      >
        {icon && icons[icon]}
      </button>
      <Tooltip tooltipPosition={tooltipPosition} alignment={tooltipAlignment}>
        {label}
      </Tooltip>
    </div>
  );
}

export default Button;
