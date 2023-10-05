import cloudflare from "cloudflare";
import { Subscription, isSubscription } from "../types/Subscription";
import { Config } from "../types/Config";
import { EnterpriseZoneWorkersKV } from "lib/cloudflare/types/EnterprizeZoneWorkersKv";
import { loadSubscription } from "./loadSubscription";

export async function loadAllSubscriptions(config: Config): Promise<Subscription[] | undefined> {
    const cf = new cloudflare({ token: config.apiToken });

    const subscriptions = [];
    let cursor = undefined;
    const MAX_ITERATIONS = 1000;
    let i = 0;

    try {
        while (cursor !== "" && i < MAX_ITERATIONS) {
            const browseResponse = await (cf.enterpriseZoneWorkersKV as EnterpriseZoneWorkersKV).browse(
                config.accountId,
                config.kvNamespace,
                { cursor }
            );

            for (const { name: emailAddress } of browseResponse.result) {
                const subscription = await loadSubscription(config, emailAddress);
                if (isSubscription(subscription)) {
                    subscriptions.push(subscription);
                }
            }

            cursor = browseResponse.result_info.cursor
            i++;
        }

        return subscriptions;
    } catch (e: unknown) {
        console.trace(e);
        return undefined;
    }
}