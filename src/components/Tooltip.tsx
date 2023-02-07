import { cva, type VariantProps } from "class-variance-authority";

const tooltipStyles = cva(
  "absolute z-10 min-w-max rounded-lg bg-gray-100 py-2 px-4 font-semibold text-gray-800 drop-shadow-lg transition-all scale-0 peer-hover:scale-100 peer-focus-visible:scale-100 group-focus-visible:scale-100 outline-none",
  {
    variants: {
      tooltipPosition: {
        top: "left-1/2 -translate-x-1/2 origin-bottom bottom-full mb-3",
        bottom: "origin-top top-full mt-3",
        left: "top-1/2 -translate-y-1/2 origin-right right-full mr-3",
        right: "origin-left left-full ml-3",
      },
      alignment: {
        left: "right-0",
        xCenter: "left-1/2 -translate-x-1/2",
        right: "left-0",
        top: "top-0",
        yCenter: "top-1/2 -translate-y-1/2",
        bottom: "bottom-0",
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

export type TooltipAlignment = VariantProps<typeof tooltipStyles>["alignment"];

interface Props extends ToolTipProps, VariantProps<typeof tooltipStyles> {}

const Tooltip = ({ tooltipPosition, children, alignment }: Props) => {
  return (
    <div className={tooltipStyles({ tooltipPosition, alignment })}>
      {children}
    </div>
  );
};

export default Tooltip;
