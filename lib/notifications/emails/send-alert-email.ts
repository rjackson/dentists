import sendgrid from "@sendgrid/mail"
import { generateDentistLink, generateManageLink, generateMapLink } from "../links";
import { Subscription } from "../types/Subscription";
import { AlertConfigurationRecord } from "../types/AlertConfigurationRecord";
import { ChangedDentist } from "lib/dentists/types/ChangedDentist";
import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";

const { SENDGRID_API_KEY, EMAIL_FROM_NAME, EMAIL_FROM_ADDRESS } = process.env

const summariseAcceptanceFilters = (alertConfig: AlertConfigurationRecord): string | undefined => {
    const activeFilters = Object.entries(alertConfig.filters).filter(([, value]) => value === true).map(([property]) => `\t${ACCEPTANCE_TYPES[property as keyof typeof ACCEPTANCE_TYPES]}`);

    if (activeFilters.length === 0) {
        return undefined
    }

    return `Patients being accepted:
${activeFilters.join('\t\n')}`
}

const summariseNewChangedDentists = (newChangedDentists: ChangedDentist[]) => newChangedDentists.map(({ currentDentist }) => {
    const dentistLink = generateDentistLink(currentDentist)
    return `\t${currentDentist.OrganisationName}: ${dentistLink}`
}).join('\n')

const renderTextContent = (subscription: Subscription, alertConfig: AlertConfigurationRecord, newChangedDentists: ChangedDentist[]): string => {
    const acceptanceFiltersSummary = summariseAcceptanceFilters(alertConfig) ?? 'All dentists in area';
    const newDentistsSummary = summariseNewChangedDentists(newChangedDentists);

    const manageNotificationsLink = generateManageLink(subscription);
    const mapLink = generateMapLink(alertConfig);

    return `We've found ${newChangedDentists.length} dentists matching your search:

\tLocation: ${alertConfig.locationName}
\tRadius: ${alertConfig.radius} km
\t${acceptanceFiltersSummary}

Those dentists are:

${newDentistsSummary}


Reopen your search on the map:

\t${mapLink}

You can update or unsubscribe from alerts at any time on our manage notifications page:

${manageNotificationsLink}`;
}


const sendAlertEmail = async (subscription: Subscription, alertConfig: AlertConfigurationRecord, newChangedDentists: ChangedDentist[]): Promise<boolean> => {
    sendgrid.setApiKey(SENDGRID_API_KEY);
    try {
        await sendgrid.send({
            to: subscription.emailAddress,
            from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM_ADDRESS },
            subject: `${newChangedDentists.length} more dentists match your search in (${alertConfig.locationName})`,
            text: renderTextContent(subscription, alertConfig, newChangedDentists),
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

export default sendAlertEmail;