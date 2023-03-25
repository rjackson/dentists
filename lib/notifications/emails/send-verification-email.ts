import sendgrid from "@sendgrid/mail"
import { AlertConfiguration, Subscription } from "../types";
import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { generateManageLink, generateVerificationLink } from "../links";


const { SENDGRID_API_KEY, EMAIL_FROM_NAME, EMAIL_FROM_ADDRESS } = process.env

const summariseAcceptanceFilters = (alertConfig: AlertConfiguration): string | undefined => {
    const activeFilters = Object.entries(alertConfig.filters).filter(([, value]) => value === true).map(([property]) => `\t${ACCEPTANCE_TYPES[property as keyof typeof ACCEPTANCE_TYPES]}`);

    if (activeFilters.length === 0) {
        return undefined
    }

    return `Patients being accepted:
${activeFilters.join('\n')}`
}

const renderTextContent = (subscription: Subscription, alertConfig: AlertConfiguration): string => {
    const acceptanceFiltersSummary = summariseAcceptanceFilters(alertConfig) ?? 'All dentists in area';

    const verificationLink = generateVerificationLink(subscription);
    const manageNotificationsLink = generateManageLink(subscription);

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


const sendVerificationEmail = async (subscription: Subscription, alertConfig: AlertConfiguration): Promise<boolean> => {
    sendgrid.setApiKey(SENDGRID_API_KEY);
    try {
        await sendgrid.send({
            to: subscription.emailAddress,
            from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM_ADDRESS },
            subject: "Verify your dentists alert subscription",
            text: renderTextContent(subscription, alertConfig),
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