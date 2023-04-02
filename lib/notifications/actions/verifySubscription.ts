import cloudflare from "cloudflare";
import { Subscription } from "../types/Subscription";
import { Config } from "../types/Config";
import { loadSubscription } from "./loadSubscription";

export async function verifySubscription(config: Config, emailAddress: string, managementUuid: string): Promise<Subscription> {
    const cf = new cloudflare({ token: config.apiToken });

    try {
        const existingSubscription = await loadSubscription(config, emailAddress)
        if (!existingSubscription) {
            throw Error("Not found");
        }

        const nowIsoString = (new Date).toISOString();

        if (managementUuid !== existingSubscription.managementUuid) {
            throw Error("Forbidden");
        }

        // no change required
        if (typeof existingSubscription.verifiedAt === "string") {
            return existingSubscription;
        }

        const subscription = {
            ...existingSubscription,
            verifiedAt: nowIsoString
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