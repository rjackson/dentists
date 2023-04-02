import cloudflare from "cloudflare";
import { Config } from "../types/Config";
import { mockKvAdd, mockKvRead } from "../__mocks__/cloudflare";
import Cloudflare from "cloudflare";
import { addAlert } from "./addAlert";
import { AlertConfiguration } from "../types/AlertConfiguration";
import { Subscription } from "../types/Subscription";

const config: Config = {
    apiToken: "test-api-token",
    accountId: "test-account-id",
    kvNamespace: "test-namespace",
};

jest.mock("cloudflare");

describe("addAlert", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        (cloudflare as jest.Mock<Cloudflare>).mockClear();

        mockKvRead.mockClear();
        mockKvAdd.mockClear();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("should return new subscription when no existing subscription is found", async () => {
        const emailAddress = "test@example.com";
        const alertConfig: AlertConfiguration = {
            locationName: "Test Land",
            lat: 12.34,
            lng: 56.78,
            radius: 50,
            filters: {
                AcceptingAdults: true,
                AcceptingAdultsEntitled: false,
                AcceptingChildren: true,
                AcceptingUrgent: false,
                AcceptingReferrals: true,
            },
        }
        const nowIsoString = new Date().toISOString();
        const expectedSubscription: Subscription = {
            emailAddress,
            createdAt: nowIsoString,
            managementUuid: expect.any(String),
            verifiedAt: null,
            alerts: [
                {
                    ...alertConfig,
                    createdAt: nowIsoString,
                    uuid: expect.any(String)
                }
            ],
        }
        mockKvRead.mockRejectedValue({
            message: "test",
            host: "test",
            hostname: "test",
            method: "test",
            path: "test",
            statusCode: 404,
            statusMessage: "blah",
        });
        const result = await addAlert(config, emailAddress, alertConfig);
        expect(result).toEqual(expectedSubscription);
        expect(mockKvAdd).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress, expect.any(String));
    });

    test("should return an updated subscription when adding an alert to an existing subscription", async () => {
        const emailAddress = "test@example.com";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid: "",
            verifiedAt: "2022-01-01T00:00:00Z",
            alerts: [
                {
                    locationName: "Test Space",
                    lat: 43.21,
                    lng: 12.34,
                    radius: 99,
                    filters: {
                        AcceptingAdults: false,
                        AcceptingAdultsEntitled: false,
                        AcceptingChildren: true,
                        AcceptingUrgent: true,
                        AcceptingReferrals: true,
                    },
                    createdAt: "2022-01-01T00:00:00Z",
                    uuid: "first-alert-uuid"
                }
            ],
        };
        const alertConfig: AlertConfiguration = {
            locationName: "Test Land",
            lat: 12.34,
            lng: 56.78,
            radius: 50,
            filters: {
                AcceptingAdults: true,
                AcceptingAdultsEntitled: false,
                AcceptingChildren: true,
                AcceptingUrgent: false,
                AcceptingReferrals: true,
            },
        }
        const expectedSubscription: Subscription = {
            ...existingSubscription,
            alerts: [
                ...existingSubscription.alerts,
                {
                    ...alertConfig,
                    createdAt: expect.any(String),
                    uuid: expect.any(String)

                }
            ]
        }
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await addAlert(config, emailAddress, alertConfig);
        expect(result).toEqual(expectedSubscription);
        expect(mockKvAdd).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress, expect.any(String));
    });

    // TODO
    test.skip("should return an the original subscription when adding a duplicate alert", async () => {
        const emailAddress = "test@example.com";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid: "",
            verifiedAt: "2022-01-01T00:00:00Z",
            alerts: [
                {
                    locationName: "Test Space",
                    lat: 43.21,
                    lng: 12.34,
                    radius: 99,
                    filters: {
                        AcceptingAdults: false,
                        AcceptingAdultsEntitled: false,
                        AcceptingChildren: true,
                        AcceptingUrgent: true,
                        AcceptingReferrals: true,
                    },
                    createdAt: "2022-01-01T00:00:00Z",
                    uuid: "first-alert-uuid"
                }
            ],
        };
        const alertConfig: AlertConfiguration = {
            locationName: "Test Space",
            lat: 43.21,
            lng: 12.34,
            radius: 99,
            filters: {
                AcceptingAdults: false,
                AcceptingAdultsEntitled: false,
                AcceptingChildren: true,
                AcceptingUrgent: true,
                AcceptingReferrals: true,
            }
        }

        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await addAlert(config, emailAddress, alertConfig);
        expect(result).toEqual(existingSubscription);
        expect(mockKvAdd).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress, expect.any(String));
    });

    test("should re-throw any errors encountered", async () => {
        const emailAddress = "test@example.com";
        const alertConfig: AlertConfiguration = {
            locationName: "Test Land",
            lat: 12.34,
            lng: 56.78,
            radius: 50,
            filters: {
                AcceptingAdults: true,
                AcceptingAdultsEntitled: false,
                AcceptingChildren: true,
                AcceptingUrgent: false,
                AcceptingReferrals: true,
            },
        }

        mockKvAdd.mockRejectedValue(new Error('Test error'));
        const t = async () => await addAlert(config, emailAddress, alertConfig);
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Test error");
    });
});