import { AlertConfigurationRecord, isAlertConfigurationRecord } from "./AlertConfigurationRecord";

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
        Array.isArray((data as Subscription).alerts) &&
        (data as Subscription).alerts.every(alert => isAlertConfigurationRecord(alert))
    )
}
