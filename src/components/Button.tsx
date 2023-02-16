import { cva, type VariantProps } from "class-variance-authority";
import {
  ArrowSquareOut,
  CaretDown,
  DotsThreeOutlineVertical,
  Download,
  Eye,
  EyeSlash,
  NotePencil,
  PencilSimple,
  Plus,
  Tag,
  Trash,
} from "phosphor-react";
import Tooltip, {
  type TooltipAlignment,
  type TooltipPosition,
} from "./Tooltip";

// CVA Variants
const buttonStyles = cva("peer flex items-center justify-center", {
  variants: {
    intent: {
      primary:
        "bg-blue-600 text-white hover:brightness-[85%] focus-visible:brightness-[85%]",
      secondary:
        "bg-white text-gray-400 hover:brightness-95 hover:text-blue-600 focus-visible:brightness-95 focus-visible:text-blue-600",
      secondaryAlt:
        "bg-transparent text-gray-600 hover:bg-gray-200 hover:brightness-95 hover:text-blue-600 focus-visible:brightness-95 focus-visible:text-blue-600",
      dangerPrimary:
        "bg-red-500 text-white hover:brightness-[85%] focus-visible:brightness-[85%]",
      dangerSecondary:
        "bg-white text-red-500 hover:text-red-500 hover:brightness-95 focus-visible:brightness-95 border-2 border-red-500",
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
      rectangle: "gap-2 py-2 px-4",
    },
    reverse: {
      true: "flex-row-reverse",
      false: "flex-row",
    },
    disabled: {
      true: "brightness-75 hover:brightness-75 focus-visible:brightness-75",
      false: "brightness-100",
    },
  },
  defaultVariants: {
    roundedFull: false,
    shadow: false,
    reverse: false,
    disabled: false,
  },
});

type ButtonIconNames =
  | "note-pencil"
  | "note-pencil-sm"
  | "tag"
  | "arrow-square-out"
  | "three-dots"
  | "caret-down"
  | "plus"
  | "pencil-simple"
  | "trash"
  | "eye"
  | "eye-slash"
  | "download";

// Base Button Props
type ButtonProps = {
  icon?: ButtonIconNames;
  label: string;
  iconOnly?: boolean;
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
  "note-pencil-sm": <NotePencil size={24} weight="bold" />,
  tag: <Tag size={28} weight="bold" />,
  "arrow-square-out": <ArrowSquareOut size={24} weight="bold" />,
  "three-dots": <DotsThreeOutlineVertical size={24} weight="fill" />,
  "caret-down": <CaretDown size={24} weight="bold" />,
  plus: <Plus size={24} weight="bold" />,
  "pencil-simple": <PencilSimple size={24} weight="bold" />,
  trash: <Trash size={24} weight="bold" />,
  eye: <Eye size={24} weight="bold" />,
  "eye-slash": <EyeSlash size={24} weight="bold" />,
  download: <Download size={24} weight="bold" />,
} as const;

function Button({
  // markup props
  icon,
  label,
  tooltipPosition,
  tooltipAlignment,
  onClick,
  iconOnly = false,
  // styling props
  intent,
  roundedFull,
  shadow,
  size,
  reverse,
  disabled,
}: Props) {
  return (
    <div className="relative">
      <button
        disabled={disabled ?? false}
        className={buttonStyles({
          intent,
          roundedFull,
          shadow,
          size,
          reverse,
          disabled,
        })}
        onClick={onClick}
      >
        {icon && icons[icon]}
        {!iconOnly && <span>{label}</span>}
      </button>
      {iconOnly && !disabled && (
        <Tooltip tooltipPosition={tooltipPosition} alignment={tooltipAlignment}>
          {label}
        </Tooltip>
      )}
    </div>
  );
}

export default Button;
