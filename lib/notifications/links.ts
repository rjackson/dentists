import getBaseUrl from "@helpers/getBaseUrl";
import { Subscription } from "./types/Subscription";
import { Dentist } from "lib/dentists/types/Dentist";
import { AlertConfigurationRecord } from "./types/AlertConfigurationRecord";

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

export const generateMapLink = (alertConfig: AlertConfigurationRecord): URL => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const mapUrl = getBaseUrl()!;

    mapUrl.searchParams.append("name", alertConfig.locationName)
    mapUrl.searchParams.append("lat", alertConfig.lat.toString())
    mapUrl.searchParams.append("lng", alertConfig.lng.toString())
    mapUrl.searchParams.append("radius", alertConfig.radius.toString())

    const checkedAcceptanceStates = Object.entries(alertConfig.filters)
        .filter(([, checked]) => checked)
        .map(([key]) => key);

    const encodedAcceptanceStates = checkedAcceptanceStates.map(encodeURIComponent).join(",");
    mapUrl.searchParams.append("accepting", encodedAcceptanceStates);

    return mapUrl;
}