import { Subscription } from "lib/notifications/types/Subscription";

const incompleteSubscription: Omit<Subscription, 'emailAddress'> = {
    createdAt: "2022-01-01T00:00:00Z",
    managementUuid: "",
    verifiedAt: null,
    alerts: []
}

export default incompleteSubscription;