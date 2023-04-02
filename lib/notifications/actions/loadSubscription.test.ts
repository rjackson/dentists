import cloudflare from 'cloudflare'
import { mockKvRead } from '../__mocks__/cloudflare';
import { loadSubscription } from './loadSubscription';
import { Subscription } from '../types/Subscription';
import Cloudflare from 'cloudflare';

const config = {
  apiToken: 'test-api-token',
  accountId: 'test-account-id',
  kvNamespace: 'test-namespace'
};

jest.mock("cloudflare");

describe("loadSubscription", () => {
  beforeEach(() => {
    (cloudflare as jest.Mock<Cloudflare>).mockClear();

    mockKvRead.mockClear();
  });

  test("should return null when subscription does not exist", async () => {
    const emailAddress = "test@example.com";
    mockKvRead.mockRejectedValue({
      message: "test",
      host: "test",
      hostname: "test",
      method: "test",
      path: "test",
      statusCode: 404,
      statusMessage: "blah",
    });
    const result = await loadSubscription(config, emailAddress);
    expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    expect(result).toBeNull();
  });

  test("should return null on any other cloudflare errors", async () => {
    const emailAddress = "test@example.com";
    mockKvRead.mockRejectedValue({ message: "something went wrong" });
    const result = await loadSubscription(config, emailAddress);
    expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    expect(result).toBeNull();
  });

  test("should return null when subscription record is not a string", async () => {
    const emailAddress = "test@example.com";
    mockKvRead.mockReturnValue(123);
    const result = await loadSubscription(config, emailAddress);
    expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    expect(result).toBeNull();
  });

  test("should return null when subscription record is invalid", async () => {
    const emailAddress = "test@example.com";
    const subscription = { not: { a: "subscription" } };
    mockKvRead.mockReturnValue(JSON.stringify(subscription));
    const result = await loadSubscription(config, emailAddress);
    expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    expect(result).toBeNull();
  });

  test("should return valid subscription when record exists and is valid", async () => {
    const emailAddress = "test@example.com";
    const subscription: Subscription = {
      emailAddress,
      createdAt: "2022-01-01T00:00:00Z",
      managementUuid: "",
      verifiedAt: null,
      alerts: []
    };
    mockKvRead.mockReturnValue(JSON.stringify(subscription));
    const result = await loadSubscription(config, emailAddress);
    expect(mockKvRead).toHaveBeenCalledWith(config.accountId, config.kvNamespace, emailAddress);
    expect(result).toEqual(subscription);
  });
});
