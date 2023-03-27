export type AcceptanceFilters = {
    AcceptingAdults: boolean
    AcceptingAdultsEntitled: boolean
    AcceptingChildren: boolean
    AcceptingUrgent: boolean
    AcceptingReferrals: boolean
}

export const isAcceptanceFilters = (data: unknown): data is AcceptanceFilters => {
    return (
        typeof (data as AcceptanceFilters).AcceptingAdults === "boolean" &&
        typeof (data as AcceptanceFilters).AcceptingAdultsEntitled === "boolean" &&
        typeof (data as AcceptanceFilters).AcceptingChildren === "boolean" &&
        typeof (data as AcceptanceFilters).AcceptingUrgent === "boolean" &&
        typeof (data as AcceptanceFilters).AcceptingReferrals === "boolean"
    )
}

export type AlertConfiguration = {
    locationName: string;
    lat: number;
    lng: number;
    radius: number;
    filters: AcceptanceFilters;
}

export type AlertConfigurationRecord = AlertConfiguration & {
    uuid: string;
    createdAt: string;
}

export const isAlertConfiguration = (data: unknown): data is AlertConfiguration => {
    return (
        typeof (data as AlertConfiguration).locationName === 'string' &&
        typeof (data as AlertConfiguration).lat === 'number' &&
        typeof (data as AlertConfiguration).lng === 'number' &&
        typeof (data as AlertConfiguration).radius === 'number' &&
        isAcceptanceFilters((data as AlertConfiguration).filters)
    )
}

export type Subscription = {
    emailAddress: string;
    createdAt: string;
    managementUuid: string;
    verifiedAt: string | null;
    alerts: AlertConfigurationRecord[];
}

export const isSubscription = (data: unknown): data is Subscription => {
    return (
        typeof (data as Subscription).emailAddress === 'string' &&
        typeof (data as Subscription).createdAt === 'string' &&
        typeof (data as Subscription).managementUuid === 'string' &&
        Array.isArray((data as Subscription).alerts)
    )
}
