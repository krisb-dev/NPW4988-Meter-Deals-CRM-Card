export interface MeterProperties {
  mpxn?: string;
  supply_start_date?: string;
  supply_end_date?: string;
}

export interface Meter {
  id: string;
  properties: MeterProperties;
}

export type MeterMutation = "unassociate" | "update";
