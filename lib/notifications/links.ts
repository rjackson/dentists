import getBaseUrl from "@helpers/getBaseUrl";
import { Subscription } from "./types/Subscription";
import { Dentist } from "lib/dentists/types/Dentist";

type AuthPayload = {
    emailAddress: string;
    managementUuid: string
}

const isAuthPayload = (data: unknown): data is AuthPayload => {
    return (
        typeof (data as AuthPayload).emailAddress === 'string' &&
        typeof (data as AuthPayload).managementUuid === 'string'
    )
}

const generateAuthToken = (subscription: Subscription): string => {
    const { emailAddress, managementUuid } = subscription;

    const authPayload: AuthPayload = {
        emailAddress,
        managementUuid
    }

    const jsonAuthPayload = JSON.stringify(authPayload)

    return Buffer.from(jsonAuthPayload).toString("base64url");
}

export const decodeAuthToken = (authToken: string): AuthPayload | undefined => {
    const jsonAuthPayload = Buffer.from(authToken, 'base64url').toString('ascii');
    const authPayload: unknown = JSON.parse(jsonAuthPayload);

    if (isAuthPayload(authPayload)) {
        return authPayload
    }

    return undefined;
}

export const generateManageLink = (subscription: Subscription): URL => {
    const baseUrl = getBaseUrl();
    const authToken = generateAuthToken(subscription);

    return new URL(`/notifications/${authToken}`, baseUrl);
}

export const generateVerificationLink = (subscription: Subscription): URL => {
    const baseUrl = getBaseUrl();
    const authToken = generateAuthToken(subscription);

    return new URL(`/notifications/verify-subscription?authToken=${authToken}`, baseUrl);
}

export const generateDentistLink = (dentist: Dentist): URL => {
    const { OrganisationName, ODSCode } = dentist;
    const nonFunctionalSlug = OrganisationName.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    return new URL(`https://www.nhs.uk/services/dentist/${nonFunctionalSlug}/${ODSCode}`)
}