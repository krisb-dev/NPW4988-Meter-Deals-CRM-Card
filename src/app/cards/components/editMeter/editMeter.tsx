import { Dispatch, useState } from "react";

import {
  Alert,
  Button,
  CloseOverlayAction,
  DateInput,
  Flex,
  Form,
  Input,
  List,
  LoadingButton,
  LoadingSpinner,
  Panel,
  PanelBody,
  PanelSection,
  Text,
} from "@hubspot/ui-extensions";
import { Meter, MeterMutation } from "../types";
import { Actions, MeterAction } from "../../state/metersList.state";

interface EditMeterProps {
  meters: Meter[];
  meterDispatch: Dispatch<MeterAction>;
  handleMutateMeters?: (action: MeterMutation) => void;
  actions: {
    closeOverlay: CloseOverlayAction;
  };
  singleEdit?: boolean;
}

const parseDateForHubSpot = (dateString: string): string | null => {
  if (!dateString || dateString.trim() === "") return null;

  const dateParts = dateString.split("/");

  const [day, month, year] = dateParts.map((part) => parseInt(part, 10));
  const paddedMonth = month.toString().padStart(2, "0");
  const paddedDay = day.toString().padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
};

const EditMeter = ({
  meters,
  meterDispatch,
  handleMutateMeters,
  actions,
  singleEdit,
}: EditMeterProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const formValues = values.targetValue;

      const propertiesToUpdate = {
        supply_start_date:
          parseDateForHubSpot(formValues.supply_start_date) ?? undefined,
        supply_end_date:
          parseDateForHubSpot(formValues.supply_end_date) ?? undefined,
      };

      console.log("meters to update", meters);
      const metersToUpdate = meters.map((meter: Meter) => {
        const updatedProperties = {
          mpxn: meter.properties.mpxn,
          ...propertiesToUpdate,
        };

        return {
          id: meter.id,
          properties: updatedProperties,
        };
      });

      console.log("ready to update", metersToUpdate);

      // Optimistically update the UI
      meterDispatch({ type: Actions.UPDATE_METERS, payload: metersToUpdate });

      await handleMutateMeters("update", metersToUpdate);

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
      throw new Error(error);
    }

    setIsUpdating(false);
  };

  const handleClose = () => {
    if (singleEdit) {
      meterDispatch({
        type: Actions.REMOVE_FROM_UPDATE_QUEUE,
        payload: meters[0].id,
      });
    }

    actions.closeOverlay("edit-meter-panel");
  };

  return (
    <Panel id="edit-meter-panel" title="Edit Meter Properties">
      <PanelBody>
        <PanelSection>
          {singleEdit ? (
            <>
              <Text>Editing single meter</Text>
            </>
          ) : (
            <>
              <Text>You are editing the following MPXNs:</Text>
              <List variant="unordered-styled">
                {meters?.map((meter) => (
                  <Text key={meter.id}>{meter.properties.mpxn}</Text>
                ))}
              </List>
            </>
          )}

          {isUpdating && (
            <Flex>
              <LoadingSpinner
                showLabel={true}
                label="Updating meters"
                size="small"
              />
            </Flex>
          )}
          {isSuccess && (
            <Alert variant="success" title="Meters updated">
              You can now close this panel
            </Alert>
          )}
          {isError && (
            <Alert variant="error" title="Error updating meters">
              Something went wrong, please try again
            </Alert>
          )}

          <Form onSubmit={(values) => handleFormSubmit(values)}>
            {JSON.stringify(meters)}
            {singleEdit && meters.length > 0 && (
              <Input
                label="MPXN"
                name="mpxn"
                readOnly={true}
                value={meters[0]?.properties.mpxn}
              />
            )}
            <Flex direction="column" gap="sm">
              <DateInput label="Supply Start Date" name="supply_start_date" />
              <DateInput label="Supply End Date" name="supply_end_date" />
              <Flex gap="sm">
                <LoadingButton
                  variant="primary"
                  loading={isUpdating}
                  type="submit"
                >
                  Update Meter Properties
                </LoadingButton>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Back
                </Button>
              </Flex>
            </Flex>
          </Form>
        </PanelSection>
      </PanelBody>
    </Panel>
  );
};

export { EditMeter };
