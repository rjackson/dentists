import { loadChangedDentists, loadDentists } from "lib/dentists/server";
import { loadAllSubscriptions } from "../actions/loadAllSubscriptions";
import { Config } from "../types/Config";
import doesChangedDentistMatchAcceptanceFilters from "../predicates/doesChangedDentistMatchAcceptanceFilters";
import sendAlertEmail from "../emails/send-alert-email";

const TAG = 'notifications/jobs/sendAlerts';

const sendAlerts = async (config: Config): Promise<void> => {
    const subscriptions = (await loadAllSubscriptions(config));
    if (!subscriptions || subscriptions.length === 0) {
        console.log(`${TAG}: Found no subscriptions to process`);
        return;
    }

    const changedDentists = loadChangedDentists();
    if (Object.keys(changedDentists).length === 0) {
        console.log(`${TAG}: No dentists have changed in the last refresh`);
        return;
    }

    for (const subscription of subscriptions) {
        console.log(`${TAG}: Processing subscription for ${subscription.emailAddress}`);

        if (!subscription.verifiedAt) {
            console.log(`${TAG}: Skipping subscription for ${subscription.emailAddress}; email address has not yet been verified`);
            continue;
        }

        for (const alert of subscription.alerts) {
            const { lat, lng, radius } = alert;
            const dentistsInArea = loadDentists(lat, lng, radius);
            const changedDentistsInArea = dentistsInArea.filter(({ ODSCode }) => changedDentists[ODSCode] !== undefined).map(({ ODSCode }) => changedDentists[ODSCode]);
            const changedDentistsMatchingFilters = changedDentistsInArea.filter(changedDentist => doesChangedDentistMatchAcceptanceFilters(changedDentist, alert.filters));
            console.log(`${TAG}: For alert ${alert.uuid}, found ${changedDentistsMatchingFilters.length} dentists matching filters (out of ${dentistsInArea.length} in the search area, ${changedDentistsInArea.length} of which had changes)`);

            if (changedDentistsMatchingFilters.length === 0) {
                continue;
            }

            await sendAlertEmail(subscription, alert, changedDentistsMatchingFilters);
        }
    }
}

export default sendAlerts;