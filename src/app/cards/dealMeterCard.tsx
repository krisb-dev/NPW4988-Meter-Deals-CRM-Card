import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonRow,
  EmptyState,
  Flex,
  Form,
  Icon,
  LoadingButton,
  LoadingSpinner,
  Modal,
  ModalBody,
  Text,
} from "@hubspot/ui-extensions";
import { hubspot } from "@hubspot/ui-extensions";

// CRM Action Button
import { CrmActionButton } from "@hubspot/ui-extensions/crm";
import { MeterList } from "./components/meterList/meterList";

// Reducer things
import {
  metersReducer,
  initialMetersState,
  Actions,
} from "./state/metersList.state";
import { MeterModal } from "./components/meterModal/meterModal";
import { MeterTable } from "./components/meterTable/meterTable";
import { Meter, MeterMutation } from "./components/types";
import { EditMeter } from "./components/editMeter/editMeter";
import { DeleteConfirmationModal } from "./components/deleteConfirmationModal/deleteConfrmationModal";

hubspot.extend(({ actions, context, runServerlessFunction }) => (
  <Extension
    context={context}
    actions={actions}
    addAlert={(actions as any).addAlert}
    runServerlessFunction={runServerlessFunction}
  />
));

const Extension = ({ context, actions, addAlert, runServerlessFunction }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshRequired, setRefreshRequired] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  const [state, dispatch] = useReducer(metersReducer, initialMetersState);
  const recordId = context.crm.objectId;

  const handleFetchMeters = useCallback(async (signal) => {
    dispatch({ type: Actions.FETCH_INIT });

    try {
      setIsFetching(true);
      const response = await hubspot.fetch(
        "https://risk-nav.marketingpod.dev/hs/serverless/api/v1/get-meters",
        {
          method: "POST",
          body: { dealId: context.crm.objectId },
        }
      );
      const responseJson = await response.json();

      if (!signal.aborted) {
        dispatch({ type: Actions.FETCH_SUCCESS, payload: responseJson });
      }
    } catch (error) {
      if (!signal.aborted) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    }

    setIsFetching(false);
  }, []);

  const handleUpdateMeter = async (metersToUpdate) => {
    try {
      setIsUpdating(true);

      // Do The Update
      await hubspot.fetch(
        "https://risk-nav.marketingpod.dev/hs/serverless/api/v1/update-meters",
        {
          method: "POST",
          body: metersToUpdate,
        }
      );

      addAlert({
        title: "Meters updated",
        message: "Associated meters have been updated",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      addAlert({
        title: "Something went wrong",
        message: "Error updating meters, please try again",
        variant: "danger",
      });
    }
    setIsUpdating(false);
  };

  const handleUnassociateMeter = async () => {
    try {
      setIsUpdating(true);

      const response = await hubspot.fetch(
        "https://risk-nav.marketingpod.dev/hs/serverless/api/v1/unassociate-meters",
        {
          method: "POST",
          body: { objectId: recordId.toString(), meterIds: state.updateQueue },
        }
      );

      addAlert({
        title: "Meters updated",
        message: "Associated meters have been updated",
        variant: "success",
      });

      // Empty the queue if the above update worked!
      dispatch({ type: Actions.CLEAR_UPDATE_QUEUE, payload: [] });
    } catch (error) {
      console.error("unassociate error", error);
      addAlert({
        title: "Something went wrong",
        message: "Error updating meters, please try again",
        variant: "danger",
      });
    }
    setIsUpdating(false);
  };

  const handleMutateMeters = async (
    action: MeterMutation,
    meterUpdates?: Meter[]
  ) => {
    if (action === "unassociate") {
      handleUnassociateMeter();
    } else if (action === "update") {
      handleUpdateMeter(meterUpdates);
    }
  };

  const handleSelectAll = () => {
    setIsSelectingAll((prev) => {
      const newValue = !prev;

      if (newValue) {
        dispatch({ type: Actions.ADD_ALL_TO_UPDATE_QUEUE });
      } else {
        dispatch({ type: Actions.REMOVE_ALL_FROM_UPDATE_QUEUE });
      }
      return newValue;
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    handleFetchMeters(controller.signal);
    return () => {
      controller.abort();
    };
  }, [handleFetchMeters]);

  if (state.status === "error") {
    return (
      <>
        <Alert variant="danger" title="Error fetching meters">
          There was an error fetching the associated meters.
        </Alert>
      </>
    );
  }

  if (isFetching) {
    return (
      <Flex direction="column" align="center" gap="medium">
        <LoadingSpinner
          label="Fetching Associated Meters"
          size="medium"
          layout="centered"
        />
        <Text format={{ fontWeight: "bold" }}>Fetching Associated Meters</Text>
      </Flex>
    );
  }

  return (
    <>
      {state.data.length > 0 || state.updateQueue.length > 0 ? (
        <Flex direction="column" gap="xs">
          <Flex gap="sm">
            <Button
              variant="primary"
              onClick={() => {
                handleSelectAll();
              }}
            >
              {!isSelectingAll ? <>Select all</> : <>Deselect all</>}
            </Button>
            <CrmActionButton
              actionType="OPEN_RECORD_ASSOCIATION_FORM"
              actionContext={{
                objectTypeId: "2-132015735",
                association: {
                  objectTypeId: "0-3",
                  objectId: context.crm.objectId,
                },
              }}
              variant="primary"
              onClick={() => setRefreshRequired(true)}
            >
              Add Meter
            </CrmActionButton>
            {refreshRequired && (
              <Button
                type="button"
                variant="transparent"
                onClick={() => {
                  handleFetchMeters(new AbortController().signal);
                  setRefreshRequired(false);
                }}
              >
                <Icon name="refresh" />
                Refresh meters
              </Button>
            )}
          </Flex>
          <MeterTable
            meters={state.data}
            updateQueue={state.updateQueue}
            meterDispatch={dispatch}
            actions={actions}
            handleMutateMeters={handleMutateMeters}
          />
          <ButtonRow>
            <Button
              overlay={
                <EditMeter
                  meters={state.updateQueue}
                  meterDispatch={dispatch}
                  handleMutateMeters={handleMutateMeters}
                  actions={actions}
                />
              }
              disabled={state.updateQueue.length > 0 ? false : true}
            >
              Edit selected meters
            </Button>

            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                console.log("Deleting!!!");
              }}
              overlay={
                <DeleteConfirmationModal
                  actions={actions}
                  updateQueue={state.updateQueue}
                  meterDispatch={dispatch}
                  handleMutateMeters={handleMutateMeters}
                />
              }
              disabled={state.updateQueue.length > 0 ? false : true}
            >
              Remove selected meters
            </Button>
          </ButtonRow>
        </Flex>
      ) : (
        <EmptyState
          title="No Associated Meters"
          layout="vertical"
          reverseOrder={true}
        >
          <Text>Add associated meters text lorem ipsum</Text>
          <Flex justify="center" gap="sm">
            <CrmActionButton
              actionType="OPEN_RECORD_ASSOCIATION_FORM"
              actionContext={{
                objectTypeId: "2-132015735",
                association: {
                  objectTypeId: "0-3",
                  objectId: context.crm.objectId,
                },
              }}
              variant="primary"
              onClick={() => setRefreshRequired(true)}
            >
              Add Meter
            </CrmActionButton>
            {refreshRequired && (
              <Button
                type="button"
                variant="transparent"
                onClick={() => {
                  handleFetchMeters(new AbortController().signal);
                  setRefreshRequired(false);
                }}
              >
                <Icon name="refresh" />
                Refresh meters
              </Button>
            )}
          </Flex>
        </EmptyState>
      )}
    </>
  );
};
