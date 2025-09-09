import { Meter, MeterProperties } from "../components/types";

export interface MetersState {
  status: "idle" | "loading" | "success" | "error";
  data: Meter[];
  error: string | null;
}

export type MeterAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "UPDATE_METER"; payload: { id: string; data: any } }
  | { type: "DELETE_METER"; payload: string }
  | { type: "RESET" }
  | { type: "CLEAR_UPDATE_QUEUE"; payload: any[] }
  | { type: "ADD_TO_UPDATE_QUEUE"; payload: Meter[] }
  | { type: "ADD_ALL_TO_UPDATE_QUEUE" }
  | { type: "REMOVE_FROM_UPDATE_QUEUE"; payload: string }
  | { type: "REMOVE_ALL_FROM_UPDATE_QUEUE"; payload: Meter[] }
  | { type: "UNASSOCIATE_METERS"; payload: Meter[] }
  | { type: "UPDATE_METERS"; payload: Meter[] }
  | {
      type: "QUEUE_PROPERTY_UPDATES";
      payload: { meterIds: string[]; updates: Partial<MeterProperties> };
    }
  | { type: "APPLY_QUEUED_UPDATES" }
  | { type: "CLEAR_UPDATE_QUEUE" };

export const Actions = {
  CREATE_ITEM: "CREATE_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  DELETE_ITEM: "DELETE_ITEM",
  ADD_TO_UPDATE_QUEUE: "ADD_TO_UPDATE_QUEUE",
  ADD_ALL_TO_UPDATE_QUEUE: "ADD_ALL_TO_UPDATE_QUEUE",
  REMOVE_FROM_UPDATE_QUEUE: "REMOVE_FROM_UPDATE_QUEUE",
  REMOVE_ALL_FROM_UPDATE_QUEUE: "REMOVE_ALL_FROM_UPDATE_QUEUE",
  // CLEAR_UPDATE_QUEUE: "CLEAR_UPDATE_QUEUE",
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  UNASSOCIATE_METERS: "UNASSOCIATE_METERS",
  UPDATE_METERS: "UPDATE_METERS",
  QUEUE_PROPERTY_UPDATES: "QUEUE_PROPERTY_UPDATES",
  APPLY_QUEUED_UPDATES: "APPLY_QUEUED_UPDATES",
  CLEAR_UPDATE_QUEUE: "CLEAR_UPDATE_QUEUE",
} as const;

export const initialMetersState = {
  status: "idle",
  data: [],
  updateQueue: [],
  error: null,
};

export const metersReducer = (state, action) => {
  switch (action.type) {
    case Actions.UPDATE_ITEM:
      const uppdatedMeterData = state.data.map((meter) => {
        if (meter.id === action.payload.id) {
          return {
            ...meter,
            properties: { ...meter.properties, ...action.payload.properties },
          };
        }

        return meter;
      });
      return {
        ...state,
        data: uppdatedMeterData,
      };

    case Actions.DELETE_ITEM:
      const updatdMeterList = state.data.filter(
        (meter) => meter.id !== action.payload
      );
      const updateQueueMeters = state.data.filter(
        (meter) => meter.id === action.payload
      );

      const updateQueue = [...state.updateQueue, ...updateQueueMeters];
      return { ...state, data: updatdMeterList, updateQueue };

    case Actions.ADD_TO_UPDATE_QUEUE:
      const meterId = action.payload;
      const currentQueue = state.updateQueue;

      const newMeter = state.data.find((meter) => meter.id === action.payload);
      currentQueue.push(newMeter);

      return {
        ...state,
        updateQueue: currentQueue,
      };

    // Add All Items to the update Queue
    case Actions.ADD_ALL_TO_UPDATE_QUEUE:
      const allUpdateQueue = state.data;

      console.log("allUpdateQueue", allUpdateQueue);

      return {
        ...state,
        updateQueue: allUpdateQueue,
      };

    // Remove Item From Queue
    case Actions.REMOVE_FROM_UPDATE_QUEUE:
      const removeItemNewQueue = state.updateQueue.filter(
        (meter) => meter.id !== action.payload
      );

      return {
        ...state,
        updateQueue: removeItemNewQueue,
      };
    // Remove All Item from Queue
    case Actions.REMOVE_ALL_FROM_UPDATE_QUEUE:
      return {
        ...state,
        updateQueue: [],
      };
    // Unasociate Meters
    case Actions.UNASSOCIATE_METERS:
      const meterIdsToUnassociate = action.payload.map((meter) => {
        return meter.id;
      });

      const metersFilteredUnsassociatedIds = state.data.filter(
        (meter) => !meterIdsToUnassociate.includes(meter.id)
      );
      return {
        ...state,
        data: metersFilteredUnsassociatedIds,
      };
    case Actions.UPDATE_METERS:
      // Updates the main state with the updates

      console.log("UPDATE_METERS", action.payload);
      const updateQueueIds = action.payload.map((meter) => {
        return meter.id;
      });

      const filteredMeters = state.data.filter(
        (meter) => !updateQueueIds.includes(meter.id)
      );

      const updatedMetersList = [...filteredMeters, ...action.payload];

      return { ...state, data: updatedMetersList };

    // case Actions.QUEUE_PROPERTY_UPDATES:
    //   const { meterIds, updates } = action.payload;
    //   const newUpdateQueue = [...state.updateQueue];

    //   meterIds.forEach((meterId) => {
    //     const existingIndex = newUpdateQueue.findIndex(
    //       (item) => item.id === meterId
    //     );

    //     if (existingIndex >= 0) {
    //       newUpdateQueue[existingIndex] = {
    //         ...newUpdateQueue[existingIndex],
    //         updates: { ...newUpdateQueue[existingIndex].updates, ...updates },
    //       };
    //     } else {
    //       newUpdateQueue.push({ id: meterId, updates });
    //     }
    //   });

    //   return { ...state, updateQueue: newUpdateQueue };
    case Actions.APPLY_QUEUED_UPDATES:
      const updatedData = state.data.map((meter) => {
        const queuedUpdate = state.updateQueue.find(
          (item) => item.id === meter.id
        );
        if (queuedUpdate) {
          return {
            ...meter,
            properties: { ...meter.properties, ...queuedUpdate.updates },
          };
        }
        return meter;
      });

      return {
        ...state,
        data: updatedData,
        // Keep the updateQueue unchanged!
      };
    case Actions.CLEAR_UPDATE_QUEUE:
      return {
        ...state,
        updateQueue: [],
      };
    case Actions.FETCH_INIT:
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case Actions.FETCH_SUCCESS:
      return {
        ...state,
        status: "success",
        data: action.payload,
      };
    case Actions.FETCH_ERROR:
      return {
        ...state,
        status: "error",
        data: action.payload,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};
