import {
  Button,
  ButtonRow,
  List,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  hubspot,
} from "@hubspot/ui-extensions";

interface DeleteConfirmationModalProps {
  actions?: any;
}

hubspot.extend(({ actions }) => <DeleteConfirmationModal actions={actions} />);

const DeleteConfirmationModal = ({ actions }: DeleteConfirmationModalProps) => {
  const handleDeletion = () => {
    console.log("Deleting The Meters");

    // Dispatch

    // API Request to handleDeleteMeters
  };
  return (
    <Modal id="delete-confirmation-modal" title="Confirm deleting meters">
      <ModalBody>
        <Text>You are deleting the following meters:</Text>
        <List>
          <Text>MPXN</Text>
          <Text>MPXN</Text>
        </List>
      </ModalBody>
      <ModalFooter>
        <ButtonRow>
          <Button variant="destructive" onClick={() => handleDeletion()}>
            Delete Meters
          </Button>
        </ButtonRow>
      </ModalFooter>
    </Modal>
  );
};

export { DeleteConfirmationModal };
