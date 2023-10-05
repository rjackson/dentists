import cloudflare from "cloudflare";
import { loadSubscription } from "./loadSubscription";
import { Config } from "../types/Config";

export async function unsubscribe(config: Config, emailAddress: string, managementUuid: string): Promise<true | void> {
    const cf = new cloudflare({ token: config.apiToken });

    try {
        const existingSubscription = await loadSubscription(config, emailAddress)
        if (!existingSubscription) {
            throw Error("Not found");
        }

        if (managementUuid !== existingSubscription.managementUuid) {
            throw Error("Forbidden");
        }

        await cf.enterpriseZoneWorkersKV.del(
            config.accountId,
            config.kvNamespace,
            emailAddress
        );
        return true;
    } catch (e: unknown) {
        console.trace(e);
        throw e;
    }
}