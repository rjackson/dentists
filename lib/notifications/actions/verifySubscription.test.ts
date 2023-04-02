import cloudflare from "cloudflare";
import { Subscription } from "../types/Subscription";
import { Config } from "../types/Config";
import { loadSubscription } from "./loadSubscription";
import { verifySubscription } from "./verifySubscription";
import { mockKvAdd, mockKvRead } from "../__mocks__/cloudflare";

const config: Config = {
    apiToken: "test-api-token",
    accountId: "test-account-id",
    kvNamespace: "test-namespace",
};

jest.mock("cloudflare");

describe("verifySubscription", () => {
    beforeEach(() => {
        cloudflare.mockClear();

        mockKvRead.mockClear();
        mockKvAdd.mockClear();
    });

    test("should throw an error when subscription does not exist", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";

        mockKvRead.mockRejectedValue({
            message: "test",
            host: "test",
            hostname: "test",
            method: "test",
            path: "test",
            statusCode: 404,
            statusMessage: "blah",
        });
        const t = async () => verifySubscription(config, emailAddress, managementUuid)
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Not found");
        expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    });

    test("should throw an error when management uuid does not match existing subscription", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid: "not-the-right-management-uuid",
            verifiedAt: null,
            alerts: [],
        };
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const t = async () => verifySubscription(config, emailAddress, managementUuid)
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Forbidden");
        expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    });

    test("should return existing subscription when verifiedAt is already a string", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid,
            verifiedAt: "2022-01-02T00:00:00Z",
            alerts: [],
        };
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await verifySubscription(config, emailAddress, managementUuid);
        expect(result).toEqual(existingSubscription);
    });

    test("should return updated subscription when verifiedAt is not a string", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid,
            verifiedAt: null,
            alerts: [],
        };
        const nowIsoString = new Date().toISOString();
        const expectedSubscription: Subscription = {
            ...existingSubscription,
            verifiedAt: nowIsoString,
        };

        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await verifySubscription(config, emailAddress, managementUuid);
        expect(result).toEqual(expectedSubscription);
        expect(mockKvAdd).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress, JSON.stringify(expectedSubscription));
    });
});