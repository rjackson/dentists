import cloudflare from "cloudflare";
import { constants } from "http2"
import { isHTTPError } from "lib/cloudflare/types/HTTPError";
import { Subscription, isSubscription } from "../types/Subscription";
import { Config } from "../types/Config";

export async function loadSubscription(config: Config, emailAddress: string): Promise<Subscription | null> {
    const cf = new cloudflare({ token: config.apiToken });

    try {
        const subscriptionJson = await cf.enterpriseZoneWorkersKV.read(
            config.accountId,
            config.kvNamespace,
            emailAddress
        );

        if (typeof subscriptionJson !== "string") {
            return null;
        }
        const subscription = JSON.parse(subscriptionJson);

        if (!isSubscription(subscription)) {
            return null;
        }

        return subscription;
    } catch (e: unknown) {
        // Key doesn't exist in Cloudflare KV
        if (isHTTPError(e) && e.statusCode == constants.HTTP_STATUS_NOT_FOUND
        ) {
            return null;
        }

        console.trace(e);
        return null;
    }
}