import sendAlerts from './sendAlerts';
import { loadAllSubscriptions } from '../actions/loadAllSubscriptions';
import { loadDentists, loadChangedDentists } from 'lib/dentists/server';
import sendAlertEmail from '../emails/send-alert-email';
import { Config } from '../types/Config';
import validSubscriptionWithoutAlerts from '../__fixtures__/subscriptions/validSubscriptionWithoutAlerts';
import testDentist from '../__fixtures__/dentists/testDentist';
import validSubscriptionWithAlerts from '../__fixtures__/subscriptions/validSubscriptionWithAlerts';
import { ChangedDentist } from 'lib/dentists/types/ChangedDentist';

jest.mock('../actions/loadAllSubscriptions');
jest.mock('lib/dentists/server');
jest.mock('../emails/send-alert-email');

const config: Config = {
    apiToken: "test-api-token",
    accountId: "test-account-id",
    kvNamespace: "test-namespace",
};

const mockedLoadAllSubscriptions = loadAllSubscriptions as jest.MockedFunction<typeof loadAllSubscriptions>
const mockedLoadDentists = loadDentists as jest.MockedFunction<typeof loadDentists>
const mockedLoadChangedDentists = loadChangedDentists as jest.MockedFunction<typeof loadChangedDentists>
const mockedSendAlertEmail = sendAlertEmail as jest.MockedFunction<typeof sendAlertEmail>

describe("sendAlerts", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test("returns early if there are no subscriptions to process", async () => {
        mockedLoadAllSubscriptions.mockResolvedValueOnce([]);

        await sendAlerts(config);
        expect(mockedLoadAllSubscriptions).toHaveBeenCalledTimes(1);
        expect(mockedLoadChangedDentists).not.toHaveBeenCalled();
        expect(mockedLoadDentists).not.toHaveBeenCalled();
        expect(mockedSendAlertEmail).not.toHaveBeenCalled();
    });

    test("returns early if there are no changed dentists to process", async () => {
        mockedLoadAllSubscriptions.mockResolvedValueOnce([validSubscriptionWithoutAlerts]);
        mockedLoadChangedDentists.mockReturnValueOnce({});

        await sendAlerts(config);
        expect(mockedLoadAllSubscriptions).toHaveBeenCalledTimes(1);
        expect(mockedLoadChangedDentists).toHaveBeenCalledTimes(1);
        expect(mockedLoadDentists).not.toHaveBeenCalled();
        expect(mockedSendAlertEmail).not.toHaveBeenCalled();
    });

    test("does not process unverified subscriptions", async () => {
        mockedLoadAllSubscriptions.mockResolvedValueOnce([
            { ...validSubscriptionWithoutAlerts, verifiedAt: null },
            { ...validSubscriptionWithAlerts, verifiedAt: null }
        ]);
        mockedLoadChangedDentists.mockReturnValueOnce({
            "test-dentist": {
                previousDentist: {
                    ...testDentist,
                    AcceptingPatients: {
                        ...testDentist.AcceptingPatients,
                        AcceptingAdults: false
                    }
                },
                currentDentist: {
                    ...testDentist,
                    AcceptingPatients: {
                        ...testDentist.AcceptingPatients,
                        AcceptingAdults: true
                    }
                },
            }
        });
        mockedLoadDentists.mockReturnValue([testDentist]);

        await sendAlerts(config);
        expect(mockedLoadAllSubscriptions).toHaveBeenCalledTimes(1);
        expect(mockedLoadChangedDentists).toHaveBeenCalledTimes(1);
        expect(mockedLoadDentists).not.toHaveBeenCalled();
        expect(mockedSendAlertEmail).not.toHaveBeenCalled();
    });

    test("does not send emails if no changed dentists match the filters", async () => {
        mockedLoadAllSubscriptions.mockResolvedValueOnce([
            { ...validSubscriptionWithoutAlerts, },
            { ...validSubscriptionWithAlerts, }
        ]);
        mockedLoadChangedDentists.mockReturnValueOnce({
            "test-dentist": {
                previousDentist: {
                    ...testDentist,
                    AcceptingPatients: {
                        ...testDentist.AcceptingPatients,
                        AcceptingAdultsEntitled: false
                    }
                },
                currentDentist: {
                    ...testDentist,
                    AcceptingPatients: {
                        ...testDentist.AcceptingPatients,
                        AcceptingAdultsEntitled: true // fixtures don't have this filter
                    }
                },
            }
        });
        mockedLoadDentists.mockReturnValue([testDentist]);

        await sendAlerts(config);
        expect(mockedLoadAllSubscriptions).toHaveBeenCalledTimes(1);
        expect(mockedLoadChangedDentists).toHaveBeenCalledTimes(1);
        expect(mockedLoadDentists).toHaveBeenCalledTimes(2);
        expect(mockedSendAlertEmail).not.toHaveBeenCalled();
    });

    test("sends emails for valid subscriptions when dentists match their filters", async () => {
        mockedLoadAllSubscriptions.mockResolvedValueOnce([
            { ...validSubscriptionWithoutAlerts },
            { ...validSubscriptionWithAlerts },
        ]);
        mockedLoadChangedDentists.mockReturnValueOnce({
            "test-dentist": {
                previousDentist: {
                    ...testDentist,
                    AcceptingPatients: {
                        ...testDentist.AcceptingPatients,
                        AcceptingAdults: false
                    }
                },
                currentDentist: {
                    ...testDentist,
                    AcceptingPatients: {
                        ...testDentist.AcceptingPatients,
                        AcceptingAdults: true // 1 of the alerts in the fixtures matches this
                    }
                },
            } as ChangedDentist
        });
        mockedLoadDentists.mockReturnValue([testDentist]);

        await sendAlerts(config);
        expect(mockedLoadAllSubscriptions).toHaveBeenCalledTimes(1);
        expect(mockedLoadChangedDentists).toHaveBeenCalledTimes(1);
        expect(mockedLoadDentists).toHaveBeenCalledTimes(2);
        expect(mockedSendAlertEmail).toHaveBeenCalledTimes(1);
    });
});
