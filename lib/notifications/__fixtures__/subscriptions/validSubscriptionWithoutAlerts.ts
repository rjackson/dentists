import { Subscription } from "lib/notifications/types/Subscription";

const validSubscriptionWithoutAlerts: Subscription = {
    emailAddress: "test@example.com",
    createdAt: "2022-01-01T00:00:00Z",
    managementUuid: "test-management-uuid",
    verifiedAt: "2022-01-01T00:00:00Z",
    alerts: []
}

export default validSubscriptionWithoutAlerts;