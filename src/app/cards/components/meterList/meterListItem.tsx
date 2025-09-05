import {
  Flex,
  DateInput,
  Text,
  Input,
  Button,
  Icon,
} from "@hubspot/ui-extensions";
import { Meter } from "../types";
import { Actions } from "../../state/metersList.state";

interface MeterListItemProps {
  meter: Meter;
  meterDispatch: any;
}

const MeterListItem = ({ meter, meterDispatch }: MeterListItemProps) => {
  const handleUpdate = (property, value) => {
    const updateValues = {
      id: meter.id,
      properties: {
        ...meter.properties,
        [property]: value,
      },
    };

    meterDispatch({ type: Actions.UPDATE_ITEM, payload: updateValues });
  };

  const handleUnassociateMeter = () => {
    meterDispatch({ type: Actions.DELETE_ITEM, payload: meter.id });
  };

  return (
    <Flex gap="extra-small" align="center" key={meter.id}>
      <Input
        label=""
        name="mpxn"
        value={meter.properties.mpxn}
        onInput={(value) => handleUpdate("mpxn", value)}
      />
      <DateInput label="" name={`supply_start_date`} format="ll" />
      <DateInput label="" name={`supply_end_date`} format="ll" />
      <Button
        type="button"
        variant="destructive"
        onClick={() => handleUnassociateMeter()}
      >
        X
      </Button>
    </Flex>
  );
};

export { MeterListItem };
