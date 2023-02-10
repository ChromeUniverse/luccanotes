import { CaretDown, CaretUp } from "phosphor-react";

function CaretUpDownIcon() {
  return (
    <div className="flex flex-col">
      <CaretUp weight="bold" size={12} />
      <CaretDown weight="bold" size={12} />
    </div>
  );
}
export default CaretUpDownIcon;
