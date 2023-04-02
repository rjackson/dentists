import cloudflare from "cloudflare";
import { randomUUID } from "crypto"
import { constants } from "http2"
import { isHTTPError } from "lib/cloudflare/HTTPError";
import { Subscription, isSubscription } from "./types/Subscription";
import { AlertConfiguration } from "./types/AlertConfiguration";

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const kvNamespace = process.env.CLOUDFLARE_KV_NAMESPACE;

const cf = new cloudflare({ token: apiToken });

export async function loadSubscription(emailAddress: string): Promise<Subscription | null> {
    try {
        const subscriptionJson = await cf.enterpriseZoneWorkersKV.read(
            accountId,
            kvNamespace,
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

export async function addAlert(emailAddress: string, alertConfig: AlertConfiguration): Promise<Subscription> {
    try {
        const existingSubscription = await loadSubscription(emailAddress)
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
            accountId,
            kvNamespace,
            emailAddress,
            JSON.stringify(subscription)
        );

        return subscription;
    } catch (e: unknown) {
        console.trace(e);
        throw e;
    }
}

export async function verifySubscription(emailAddress: string, managementUuid: string): Promise<Subscription> {
    try {
        const existingSubscription = await loadSubscription(emailAddress)
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
            accountId,
            kvNamespace,
            emailAddress,
            JSON.stringify(subscription)
        );

        return subscription;
    } catch (e: unknown) {
        console.trace(e);
        throw e;
    }
}

export async function deleteAlert(emailAddress: string, managementUuid: string, alertUuid: string): Promise<Subscription | undefined> {
    try {
        const existingSubscription = await loadSubscription(emailAddress)
        if (!existingSubscription) {
            throw Error("Not found");
        }

        if (managementUuid !== existingSubscription.managementUuid) {
            throw Error("Forbidden");
        }

        const remainingAlerts = existingSubscription.alerts.filter(alert => alert.uuid !== alertUuid);

        // No longer have a need to hold any personal details
        if (remainingAlerts.length === 0) {
            await cf.enterpriseZoneWorkersKV.del(accountId, kvNamespace, emailAddress);
            return undefined;
        }

        const subscription = {
            ...existingSubscription,
            alerts: remainingAlerts
        }

        await cf.enterpriseZoneWorkersKV.add(
            accountId,
            kvNamespace,
            emailAddress,
            JSON.stringify(subscription)
        );

        return subscription;
    } catch (e: unknown) {
        console.trace(e);
        throw e;
    }
}

export async function unsubscribe(emailAddress: string, managementUuid: string): Promise<true | void> {
    try {
        const existingSubscription = await loadSubscription(emailAddress)
        if (!existingSubscription) {
            throw Error("Not found");
        }

        if (managementUuid !== existingSubscription.managementUuid) {
            throw Error("Forbidden");
        }

        await cf.enterpriseZoneWorkersKV.del(accountId, kvNamespace, emailAddress);
        return true;
    } catch (e: unknown) {
        console.trace(e);
        throw e;
    }
}