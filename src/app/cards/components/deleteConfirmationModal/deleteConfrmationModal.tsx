import {
  Button,
  ButtonRow,
  CloseOverlayAction,
  List,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  UiePlatformActions,
  hubspot,
} from "@hubspot/ui-extensions";
import { Meter, MeterMutation } from "../types";
import { Dispatch } from "react";
import { Actions, MeterAction } from "../../state/metersList.state";

interface DeleteConfirmationModalProps {
  actions: {
    closeOverlay: CloseOverlayAction;
  };
  updateQueue: Meter[];
  meterDispatch: Dispatch<MeterAction>;
  handleMutateMeters: (action: MeterMutation) => void;
}

const DeleteConfirmationModal = ({
  actions,
  meterDispatch,
  updateQueue,
  handleMutateMeters,
}: DeleteConfirmationModalProps) => {
  const handleDeletion = async () => {
    console.log("Deleting The Meters", updateQueue);

    try {
      meterDispatch({ type: Actions.UNASSOCIATE_METERS, payload: updateQueue });
      await handleMutateMeters("unassociate");
    } catch (error) {
      throw new Error(error);
    }
  };
  return (
    <Modal id="delete-confirmation-modal" title="Confirm deleting meters">
      <ModalBody>
        <Text>You are deleting the following meters:</Text>

        <List>
          <Text>{JSON.stringify(updateQueue)}</Text>
          {/* {updateQueue.map((meter) => (
            <Text key={meter.id}>{meter.properties.mpxn}</Text>
          ))} */}
        </List>
      </ModalBody>
      <ModalFooter>
        <ButtonRow>
          <Button
            variant="destructive"
            onClick={() => {
              handleDeletion();
              actions.closeOverlay("delete-confirmation-modal");
            }}
          >
            Delete Meters
          </Button>
        </ButtonRow>
      </ModalFooter>
    </Modal>
  );
};

export { DeleteConfirmationModal };
