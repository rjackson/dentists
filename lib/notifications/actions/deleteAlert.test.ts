import cloudflare from "cloudflare";
import { Config } from "../types/Config";
import { mockKvAdd, mockKvDel, mockKvRead } from "../__mocks__/cloudflare";
import Cloudflare from "cloudflare";
import { Subscription } from "../types/Subscription";
import { deleteAlert } from "./deleteAlert";

const config: Config = {
    apiToken: "test-api-token",
    accountId: "test-account-id",
    kvNamespace: "test-namespace",
};

jest.mock("cloudflare");

describe("deleteAlert", () => {
    beforeEach(() => {
        (cloudflare as jest.Mock<Cloudflare>).mockClear();

        mockKvRead.mockClear();
        mockKvAdd.mockClear();
    });

    test("should successfully delete an alert from a valid subscription", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const alertUuid = "first-alert-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid,
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
                },
                {
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
                    createdAt: "2022-01-02T00:00:00Z",
                    uuid: "second-alert-uuid"
                }
            ],
        };
        const expectedSubscription: Subscription = {
            ...existingSubscription,
            alerts: [
                existingSubscription.alerts[1]
            ]
        }
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await deleteAlert(config, emailAddress, managementUuid, alertUuid)
        expect(result).toEqual(expectedSubscription);
        expect(mockKvAdd).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress, JSON.stringify(expectedSubscription))
    });

    test("should delete the whole subscription if the last alert is being deleted", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const alertUuid = "first-alert-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid,
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
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await deleteAlert(config, emailAddress, managementUuid, alertUuid)
        expect(result).toEqual(undefined);
        expect(mockKvDel).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress)
    });

    test("should throw an error when subscription does not exist", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const alertUuid = "first-alert-uuid";
        mockKvRead.mockRejectedValue({
            message: "test",
            host: "test",
            hostname: "test",
            method: "test",
            path: "test",
            statusCode: 404,
            statusMessage: "blah",
        });
        const t = async () => deleteAlert(config, emailAddress, managementUuid, alertUuid)
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Not found");
    });

    test("should throw an error when management uuid does not match existing subscription", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const alertUuid = "first-alert-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid: "not-the-right-management-uuid",
            verifiedAt: null,
            alerts: [],
        };
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const t = async () => deleteAlert(config, emailAddress, managementUuid, alertUuid)
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Forbidden");
    });
});