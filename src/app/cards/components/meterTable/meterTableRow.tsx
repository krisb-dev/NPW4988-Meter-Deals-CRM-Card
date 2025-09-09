import { Dispatch, useEffect, useState } from "react";
import {
  TableRow,
  TableCell,
  Checkbox,
  Flex,
  Button,
  CloseOverlayAction,
} from "@hubspot/ui-extensions";
import { EditMeter } from "../editMeter/editMeter";
import { Meter } from "../types";
import { Actions, MeterAction } from "../../state/metersList.state";
import { DeleteConfirmationModal } from "../deleteConfirmationModal/deleteConfrmationModal";

interface MeterTableRowProps {
  meter: Meter;
  meterDispatch: Dispatch<MeterAction>;
  updateQueue: Meter[];
  actions: {
    closeOverlay: CloseOverlayAction;
  };
  handleMutateMeters: (action: string) => void;
}

const MeterTableRow = ({
  meter,
  meterDispatch,
  updateQueue,
  actions,
  handleMutateMeters,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckMeter = (action?: string) => {
    const isInQueue = updateQueue.some((item) => item.id === meter.id);

    if (action === "init") {
      setIsChecked(isInQueue);
    } else {
      setIsChecked((prev) => !prev);

      if (!isChecked) {
        meterDispatch({
          type: Actions.ADD_TO_UPDATE_QUEUE,
          payload: meter.id,
        });
      } else {
        meterDispatch({
          type: Actions.REMOVE_FROM_UPDATE_QUEUE,
          payload: meter.id,
        });
      }
    }
  };

  const handleEditClick = () => {
    const isInQueue = updateQueue.some((item) => item.id === meter.id);

    if (!isInQueue) {
      meterDispatch({
        type: Actions.ADD_TO_UPDATE_QUEUE,
        payload: meter.id,
      });
    }
  };

  const handleDeleteClick = () => {
    console.log("handleDeleteClick");
  };

  useEffect(() => {
    const isInQueue = updateQueue.some((item) => item.id === meter.id);
    setIsChecked(isInQueue);
  }, [updateQueue, meter.id]);

  return (
    <TableRow>
      <TableCell width="min">
        <Checkbox onChange={() => handleCheckMeter()} checked={isChecked} />
      </TableCell>
      <TableCell width="min">{meter.properties.mpxn}</TableCell>
      <TableCell width="min">{meter.properties.supply_start_date}</TableCell>
      <TableCell width="min">{meter.properties.supply_end_date}</TableCell>
      <TableCell>
        <Flex gap="sm">
          <Button
            overlay={
              <EditMeter
                meters={updateQueue}
                singleEdit={true}
                meterDispatch={meterDispatch}
                actions={actions}
              />
            }
            onClick={() => handleCheckMeter()}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              meterDispatch({
                type: Actions.ADD_TO_UPDATE_QUEUE,
                payload: meter.id,
              })
            }
            overlay={
              <DeleteConfirmationModal
                actions={actions}
                updateQueue={updateQueue}
                meterDispatch={meterDispatch}
                handleMutateMeters={handleMutateMeters}
              />
            }
          >
            Delete
          </Button>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export { MeterTableRow };
