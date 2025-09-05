import { Meter } from "../components/types";

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
  | { type: "REMOVE_FROM_UPDATE_QUEUE"; payload: Meter[] };

export const Actions = {
  CREATE_ITEM: "CREATE_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  DELETE_ITEM: "DELETE_ITEM",
  ADD_TO_UPDATE_QUEUE: "ADD_TO_UPDATE_QUEUE",
  REMOVE_FROM_UPDATE_QUEUE: "REMOVE_FROM_UPDATE_QUEUE",
  CLEAR_UPDATE_QUEUE: "CLEAR_UPDATE_QUEUE",
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
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
      const updateMeterItems = state.data.filter(
        (meter) => meter.id === action.payload
      );

      const currentQueue = state.updatedQueue ?? [];

      const metersToAddToQueue = [...currentQueue, ...updateMeterItems];
      return {
        ...state,
        updateQueue: metersToAddToQueue,
      };

    case Actions.REMOVE_FROM_UPDATE_QUEUE:
      const updatedQueue = state.updateQueue.filter(
        (meter) => meter.id !== action.payload
      );
      return { ...state, updateQueue: updatedQueue };
    case Actions.CLEAR_UPDATE_QUEUE:
      return { ...state, updateQueue: action.payload };
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
