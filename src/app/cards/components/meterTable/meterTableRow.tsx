import { Dispatch, useState } from "react";
import {
  TableRow,
  TableCell,
  Checkbox,
  Flex,
  Button,
} from "@hubspot/ui-extensions";
import { EditMeter } from "../editMeter/editMeter";
import { Meter } from "../types";
import { Actions, MeterAction } from "../../state/metersList.state";

interface MeterTableRowProps {
  meter: Meter;
  meterDispatch: Dispatch<MeterAction>;
}

const MeterTableRow = ({ meter, meterDispatch }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckMeter = () => {
    setIsChecked((prev) => {
      const newValue = !prev;

      if (newValue) {
        meterDispatch({ type: Actions.ADD_TO_UPDATE_QUEUE, payload: meter.id });
      } else {
        meterDispatch({
          type: Actions.REMOVE_FROM_UPDATE_QUEUE,
          payload: meter.id,
        });
      }

      return newValue;
    });
  };
  return (
    <TableRow>
      <TableCell width="min">
        <Checkbox onChange={handleCheckMeter} />
      </TableCell>
      <TableCell width="min">{meter.properties.mpxn}</TableCell>
      <TableCell width="min">{meter.properties.supply_start_date}</TableCell>
      <TableCell width="min">{meter.properties.supply_end_date}</TableCell>
      <TableCell>
        <Flex gap="sm">
          <Button overlay={<EditMeter meter={meter} />}>Edit</Button>
          <Button variant="destructive">Delete</Button>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export { MeterTableRow };
