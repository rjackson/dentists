import { AcceptanceFilters, isAcceptanceFilters } from "./AcceptanceFilters";

export type AlertConfiguration = {
    locationName: string;
    lat: number;
    lng: number;
    radius: number;
    filters: AcceptanceFilters;
}

export const isAlertConfiguration = (data: unknown): data is AlertConfiguration => {
    return (
        typeof (data as AlertConfiguration)?.locationName === 'string' &&
        typeof (data as AlertConfiguration)?.lat === 'number' &&
        typeof (data as AlertConfiguration)?.lng === 'number' &&
        typeof (data as AlertConfiguration)?.radius === 'number' &&
        isAcceptanceFilters((data as AlertConfiguration).filters)
    )
}