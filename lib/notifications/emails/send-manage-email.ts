import sendgrid from "@sendgrid/mail"
import { generateManageLink } from "../links";
import { Subscription } from "../types/Subscription";

const { SENDGRID_API_KEY, EMAIL_FROM_NAME, EMAIL_FROM_ADDRESS } = process.env

const renderTextContent = (subscription: Subscription): string => {
    const manageNotificationsLink = generateManageLink(subscription);

    return `Here's the link to manage your Dentists on a Map notifications:

${manageNotificationsLink}

You can update or unsubscribe from alerts at any time from this page.`
}


const sendManageEmail = async (subscription: Subscription): Promise<boolean> => {
    sendgrid.setApiKey(SENDGRID_API_KEY);
    try {
        await sendgrid.send({
            to: subscription.emailAddress,
            from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM_ADDRESS },
            subject: "Manage your Dentists on a Map notifications",
            text: renderTextContent(subscription),
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

export default sendManageEmail;