import cloudflare from "cloudflare";
import { Subscription } from "../types/Subscription";
import { loadSubscription } from "./loadSubscription";
import { Config } from "../types/Config";

export async function deleteAlert(config: Config, emailAddress: string, managementUuid: string, alertUuid: string): Promise<Subscription | undefined> {
    const cf = new cloudflare({ token: config.apiToken });

    try {
        const existingSubscription = await loadSubscription(config, emailAddress)
        if (!existingSubscription) {
            throw Error("Not found");
        }

        if (managementUuid !== existingSubscription.managementUuid) {
            throw Error("Forbidden");
        }

        const remainingAlerts = existingSubscription.alerts.filter(alert => alert.uuid !== alertUuid);

        // No longer have a need to hold any personal details
        if (remainingAlerts.length === 0) {
            await cf.enterpriseZoneWorkersKV.del(
                config.accountId,
                config.kvNamespace,
                emailAddress
            );
            return undefined;
        }

        const subscription = {
            ...existingSubscription,
            alerts: remainingAlerts
        }

        await cf.enterpriseZoneWorkersKV.add(
            config.accountId,
            config.kvNamespace,
            emailAddress,
            JSON.stringify(subscription)
        );

        return subscription;
    } catch (e: unknown) {
        console.trace(e);
        throw e;
    }
}