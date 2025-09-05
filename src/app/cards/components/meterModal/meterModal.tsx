import {
  Modal,
  ModalBody,
  Alert,
  Flex,
  LoadingSpinner,
  Box,
  LoadingButton,
  Icon,
  Button,
  Text,
} from "@hubspot/ui-extensions";
import { CrmActionButton } from "@hubspot/ui-extensions/crm";
import { MeterList } from "../meterList/meterList";
import { MeterAction, MetersState } from "../../state/metersList.state";
import { Dispatch } from "react";

interface MeterModalProps {
  state: MetersState;
  isUpdating: boolean;
  dispatch: Dispatch<MeterAction>;
  currentObjectId: number;
  handleUpdateMeter: () => void;
  handleFetchMeters: (signal: AbortSignal) => void;
}

const MeterModal = ({
  state,
  isUpdating,
  dispatch,
  currentObjectId,
  handleUpdateMeter,
  handleFetchMeters,
}: MeterModalProps) => {
  return (
    <Modal id="meter-associations" title="Associated Meters" width="lg">
      <ModalBody>
        <Text>Associated Meters!</Text>
        <Alert title="" variant="tip">
          Please refresh the page after creating or associating a new meter.
        </Alert>

        <Flex direction="column" gap="small" align="center">
          <Flex></Flex>

          {state.status === "loading" ? (
            <LoadingSpinner
              showLabel={true}
              label="Fetching meters"
              size="xs"
            />
          ) : null}
          {isUpdating && (
            <LoadingSpinner
              showLabel={true}
              label="Updating meters"
              size="xs"
            />
          )}
          <MeterList meters={state.data} meterDispatch={dispatch} />
        </Flex>

        <Flex gap="sm" direction="row">
          <Box>
            <LoadingButton
              variant="primary"
              type="button"
              loading={state.status === "loading"}
              onClick={() => handleFetchMeters(new AbortController().signal)}
            >
              <Icon name="refresh" /> Refresh
            </LoadingButton>
          </Box>
          <Box alignSelf="end">
            <Button
              variant="primary"
              onClick={() => handleUpdateMeter()}
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Flex>
      </ModalBody>
    </Modal>
  );
};

export { MeterModal };
