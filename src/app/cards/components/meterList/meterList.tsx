import { Meter } from "../types";
import { MeterListItem } from "./meterListItem";

export interface MeterListProps {
  meters: Meter[];
  meterDispatch: any;
}

const MeterList = ({ meters, meterDispatch }: MeterListProps) => {
  return (
    <>
      {meters.map((meter: Meter) => (
        <MeterListItem
          key={meter.id}
          meter={meter}
          meterDispatch={meterDispatch}
        />
      ))}
    </>
  );
};

export { MeterList };
