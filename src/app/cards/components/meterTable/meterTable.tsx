import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Flex,
  Checkbox,
  CloseOverlayAction,
} from "@hubspot/ui-extensions";
import { Meter } from "../types";
import { CrmActionButton } from "@hubspot/ui-extensions/crm";
import { EditMeter } from "../editMeter/editMeter";
import { MeterTableRow } from "./meterTableRow";
import { Dispatch } from "react";
import { MeterAction } from "../../state/metersList.state";

interface MeterTableProps {
  meters: Meter[];
  meterDispatch: Dispatch<MeterAction>;
  updateQueue: Meter[];
  actions: {
    closeOverlay: CloseOverlayAction;
  };
  handleMutateMeters: (action: string) => void;
}

const MeterTable = ({
  meters,
  meterDispatch,
  updateQueue,
  actions,
  handleMutateMeters,
}) => {
  return (
    <>
      <Table bordered={true}>
        <TableHead>
          <TableRow>
            <TableHeader>Check</TableHeader>
            <TableHeader width="min">MPXN</TableHeader>
            <TableHeader width="min">Supply Start Date</TableHeader>
            <TableHeader width="min">Supply End Date</TableHeader>
            <TableHeader width="min">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {meters.map((meter) => (
            <MeterTableRow
              key={meter.id}
              meter={meter}
              meterDispatch={meterDispatch}
              updateQueue={updateQueue}
              actions={actions}
              handleMutateMeters={handleMutateMeters}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export { MeterTable };
