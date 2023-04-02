import cloudflare from "cloudflare";
import { Config } from "../types/Config";
import { mockKvAdd, mockKvDel, mockKvRead } from "../__mocks__/cloudflare";
import Cloudflare from "cloudflare";
import { Subscription } from "../types/Subscription";
import { unsubscribe } from "./unsubscribe";

const config: Config = {
    apiToken: "test-api-token",
    accountId: "test-account-id",
    kvNamespace: "test-namespace",
};

jest.mock("cloudflare");

describe("unsubscribe", () => {
    beforeEach(() => {
        (cloudflare as jest.Mock<Cloudflare>).mockClear();

        mockKvRead.mockClear();
        mockKvAdd.mockClear();
    });

    test("should successfully unsubscribe a valid subscription", async () => {
        const emailAddress = "test@example.com";
        const managementUuid = "test-management-uuid";
        const existingSubscription: Subscription = {
            emailAddress,
            createdAt: "2022-01-01T00:00:00Z",
            managementUuid,
            verifiedAt: "2022-01-01T00:00:00Z",
            alerts: [],
        };
        mockKvRead.mockReturnValue(JSON.stringify(existingSubscription));
        const result = await unsubscribe(config, emailAddress, managementUuid)
        expect(result).toEqual(true);
        expect(mockKvDel).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress)
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
        const t = async () => unsubscribe(config, emailAddress, managementUuid)
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Not found");
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
        const t = async () => unsubscribe(config, emailAddress, managementUuid)
        await expect(t).rejects.toThrow(Error);
        await expect(t).rejects.toThrow("Forbidden");
    });
});