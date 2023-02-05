import { cva, VariantProps } from "class-variance-authority";

const tooltipStyles = cva(
  "absolute z-10 min-w-max rounded-lg bg-gray-100 py-2 px-4 font-semibold text-gray-800 drop-shadow-lg transition-all scale-0 peer-hover:scale-100",
  {
    variants: {
      tooltipPosition: {
        top: "left-1/2 -translate-x-1/2 origin-bottom bottom-full mb-3",
        bottom: "left-1/2 -translate-x-1/2 origin-top top-full mt-3",
        left: "top-1/2 -translate-y-1/2 origin-right right-full mr-3",
        right: "top-1/2 -translate-y-1/2 origin-left left-full ml-3",
      },
    },
  }
);

type ToolTipProps = {
  // label: string;
  children: React.ReactNode;
};

export type TooltipPosition = VariantProps<
  typeof tooltipStyles
>["tooltipPosition"];

interface Props extends ToolTipProps, VariantProps<typeof tooltipStyles> {}

const Tooltip = ({ tooltipPosition, children }: Props) => {
  return <div className={tooltipStyles({ tooltipPosition })}>{children}</div>;
};

export default Tooltip;
