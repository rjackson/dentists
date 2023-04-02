import { AlertConfiguration, isAlertConfiguration } from "./AlertConfiguration";

export type AlertConfigurationRecord = AlertConfiguration & {
    uuid: string;
    createdAt: string;
}

export const isAlertConfigurationRecord = (data: unknown): data is AlertConfiguration => {
    return (
        typeof (data as AlertConfigurationRecord).uuid === 'string' &&
        typeof (data as AlertConfigurationRecord).createdAt === 'string' &&
        isAlertConfiguration((data as AlertConfigurationRecord))
    )
}