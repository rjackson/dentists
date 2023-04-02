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