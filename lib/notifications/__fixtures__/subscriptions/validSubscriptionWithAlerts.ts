import { Subscription } from "lib/notifications/types/Subscription";

const validSubscriptionWithAlerts: Subscription = {
    emailAddress: "test@example.com",
    createdAt: "2022-01-01T00:00:00Z",
    managementUuid: "",
    verifiedAt: null,
    alerts: [
        {
            locationName: "Test Space",
            lat: 43.21,
            lng: 12.34,
            radius: 99,
            filters: {
                AcceptingAdults: false,
                AcceptingAdultsEntitled: false,
                AcceptingChildren: true,
                AcceptingUrgent: true,
                AcceptingReferrals: true,
            },
            createdAt: "2022-01-01T00:00:00Z",
            uuid: "first-alert-uuid"
        },
        {
            locationName: "Test Land",
            lat: 12.34,
            lng: 56.78,
            radius: 50,
            filters: {
                AcceptingAdults: true,
                AcceptingAdultsEntitled: false,
                AcceptingChildren: true,
                AcceptingUrgent: false,
                AcceptingReferrals: true,
            },
            createdAt: "2022-01-02T00:00:00Z",
            uuid: "second-alert-uuid"
        }
    ],
}

export default validSubscriptionWithAlerts;