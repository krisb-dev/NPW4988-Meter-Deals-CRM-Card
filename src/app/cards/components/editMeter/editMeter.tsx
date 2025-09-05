import {
  Button,
  DateInput,
  Flex,
  Form,
  Input,
  Panel,
  PanelBody,
  PanelSection,
  Text,
} from "@hubspot/ui-extensions";
import { Meter } from "../types";

interface EditMeterProps {
  meter: Meter[];
}

const EditMeter = ({ meters }: EditMeterProps) => {
  const handleFormSubmit = (values) => {
    console.log("Submitting form", values);
    // Loop through meters and update properties with form values
    // return array
    // dispatch that array
  };

  return (
    <Panel id="edit-meter" title="Edit Meter Properties">
      <PanelBody>
        <PanelSection>
          <Text>Editing Meters</Text>
          {JSON.stringify(meters)}
          <Form onSubmit={(values) => handleFormSubmit(values)}>
            <Input label="MPXN" name="mpxn" readOnly={true} />
            <DateInput label="Supply Start Date" name="supply_start_date" />
            <DateInput label="Supply End Date" name="supply_end_date" />
            <Flex>
              <Button type="submit">Update Meter Properties</Button>
            </Flex>
          </Form>
        </PanelSection>
      </PanelBody>
    </Panel>
  );
};

export { EditMeter };
