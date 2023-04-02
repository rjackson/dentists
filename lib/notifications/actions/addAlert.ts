import cloudflare from "cloudflare";
import { randomUUID } from "crypto"
import { Subscription } from "../types/Subscription";
import { AlertConfiguration } from "../types/AlertConfiguration";
import { Config } from "../types/Config";
import { loadSubscription } from "./loadSubscription";

export async function addAlert(config: Config, emailAddress: string, alertConfig: AlertConfiguration): Promise<Subscription> {
    const cf = new cloudflare({ token: config.apiToken });

    try {
        const existingSubscription = await loadSubscription(config, emailAddress)
        const nowIsoString = (new Date).toISOString();

        // TODO: deduplicate alerts somehow

        const subscription: Subscription = {
            ...existingSubscription,
            emailAddress,
            createdAt: existingSubscription?.createdAt ?? nowIsoString,
            verifiedAt: existingSubscription?.verifiedAt ?? null,
            managementUuid: existingSubscription?.managementUuid ?? randomUUID(),
            alerts: [
                ...existingSubscription?.alerts ?? [],
                {
                    ...alertConfig,
                    uuid: randomUUID(),
                    createdAt: nowIsoString
                }
            ]
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