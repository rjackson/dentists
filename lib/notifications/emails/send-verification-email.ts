import getBaseUrl from "@helpers/getBaseUrl";
import sendgrid from "@sendgrid/mail"
import { AlertConfiguration } from "../types";
import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";

const VERIFICATION_PATH = '/api/verify-subscription';
const MANAGE_NOTIFICATIONS_PATH = '/notifications'

const { SENDGRID_API_KEY, EMAIL_FROM_ADDRESS } = process.env

const summariseAcceptanceFilters = (alertConfig: AlertConfiguration): string | undefined => {
    const activeFilters = Object.entries(alertConfig.filters).filter(([, value]) => value === true).map(([property]) => `\t${ACCEPTANCE_TYPES[property as keyof typeof ACCEPTANCE_TYPES]}`);

    if (activeFilters.length === 0) {
        return undefined
    }

    return `Patients being accepted:
${activeFilters.join('\n')}`
}

const renderTextContent = (emailAddress: string, managementUuid: string, alertConfig: AlertConfiguration): string => {
    const baseUrl = getBaseUrl();
    const authSearchParams = new URLSearchParams({
        emailAddress,
        managementUuid
    })

    const acceptanceFiltersSummary = summariseAcceptanceFilters(alertConfig) ?? 'All dentists in area';
    const verificationLink = new URL(`${VERIFICATION_PATH}?${authSearchParams}`, baseUrl);
    const manageNotificationsLink = new URL(`${MANAGE_NOTIFICATIONS_PATH}?${authSearchParams}`, baseUrl);

    return `We're almost ready to set up your dentists alert for the following search:

Location: ${alertConfig.locationName}
Radius: ${alertConfig.radius} km
${acceptanceFiltersSummary}

To confirm you want to receive these alerts, please click the following link:

${verificationLink}

You'll only need to do this once. Once verified, any more alerts you set up will start working immediately.

You can update or unsubscribe from alerts at any time on our manage notifications page:

${manageNotificationsLink}`;
}


const sendVerificationEmail = async (emailAddress: string, managementUuid: string, alertConfig: AlertConfiguration): Promise<boolean> => {
    sendgrid.setApiKey(SENDGRID_API_KEY);
    try {
        await sendgrid.send({
            to: emailAddress,
            from: EMAIL_FROM_ADDRESS,
            subject: "Verify your dentists alert subscription",
            text: renderTextContent(emailAddress, managementUuid, alertConfig),
            trackingSettings: {
                clickTracking: {
                    enable: false
                }
            }
        })
        return true;
    } catch (e: unknown) {
        console.trace(e);
        return false;
    }

}

export default sendVerificationEmail;