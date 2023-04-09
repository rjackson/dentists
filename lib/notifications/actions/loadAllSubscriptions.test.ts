import cloudflare from 'cloudflare'
import { mockKvBrowse, mockKvRead } from '../__mocks__/cloudflare';
import { loadAllSubscriptions } from './loadAllSubscriptions';
import Cloudflare from 'cloudflare';
import validSubscriptionWithAlerts from '../__fixtures__/subscriptions/validSubscriptionWithAlerts';
import validSubscriptionWithoutAlerts from '../__fixtures__/subscriptions/validSubscriptionWithoutAlerts';
import incompleteSubscription from '../__fixtures__/subscriptions/incompleteSubscription';

const config = {
  apiToken: 'test-api-token',
  accountId: 'test-account-id',
  kvNamespace: 'test-namespace'
};

jest.mock("cloudflare");

describe("loadAllSubscriptions", () => {
  beforeEach(() => {
    (cloudflare as jest.Mock<Cloudflare>).mockClear();

    mockKvBrowse.mockClear();
    mockKvRead.mockClear();
  });

  test("should return an empty array if there are no subscriptions", async () => {
    mockKvBrowse.mockReturnValue({
      errors: [],
      messages: [],
      result: [],
      success: true,
      result_info: {
        count: 0,
        cursor: ""
      }
    });

    const result = await loadAllSubscriptions(config);
    expect(result).toHaveLength(0);
    expect(mockKvBrowse).toHaveBeenCalledTimes(1);
    expect(mockKvBrowse).toHaveBeenCalledWith(config.accountId, config.kvNamespace, { cursor: undefined });
  });

  test("should return undefined on any other cloudflare errors", async () => {
    mockKvBrowse.mockRejectedValue({ message: "something went wrong" });
    const result = await loadAllSubscriptions(config);
    expect(mockKvBrowse).toHaveBeenCalledWith(config.accountId, config.kvNamespace, { cursor: undefined });
    expect(result).toBeUndefined();
  });

  test("should return some subscriptions when some records are subscriptions and some arent", async () => {
    mockKvBrowse.mockReturnValue({
      errors: [],
      messages: [],
      result: [
        "test1@example.com",
        "test2@example.com",
        "test3@example.com",
        "test4@example.com",
        "test5@example.com",
        "test6@example.com",
      ],
      success: true,
      result_info: {
        count: 6,
        cursor: ""
      }
    });
    mockKvRead
      .mockReturnValueOnce(JSON.stringify(validSubscriptionWithAlerts))
      .mockReturnValueOnce(JSON.stringify(validSubscriptionWithoutAlerts))
      .mockReturnValueOnce(JSON.stringify(incompleteSubscription))
      .mockReturnValueOnce(1234)
      .mockRejectedValue({ message: "Oh dear, I have thrown an error!" })
      .mockReturnValueOnce("i am not a subscription")

    const result = await loadAllSubscriptions(config);
    expect(result).toHaveLength(2);
    expect(mockKvBrowse).toHaveBeenCalledTimes(1);
    expect(mockKvBrowse).toHaveBeenCalledWith(config.accountId, config.kvNamespace, { cursor: undefined });
    expect(mockKvRead).toHaveBeenCalledTimes(6);
  });

  test("should page through responses from Cloudflare if cursor is present", async () => {
    const mockBrowseResponse = {
      errors: [],
      messages: [],
      result: [
        "test1@example.com",
        "test2@example.com",
        "test3@example.com",
        "test4@example.com",
        "test5@example.com",
        "test6@example.com",
        "test7@example.com",
        "test8@example.com",
        "test9@example.com",
        "test10@example.com",
      ],
      success: true,
      result_info: {
        count: 50,
        cursor: ""
      }
    }
    mockKvBrowse
      .mockReturnValueOnce({ ...mockBrowseResponse, result_info: { count: 50, cursor: "cursor-for-second-page" } })
      .mockReturnValueOnce({ ...mockBrowseResponse, result_info: { count: 50, cursor: "cursor-for-third-page" } })
      .mockReturnValueOnce({ ...mockBrowseResponse, result_info: { count: 50, cursor: "cursor-for-fourth-page" } })
      .mockReturnValueOnce({ ...mockBrowseResponse, result_info: { count: 50, cursor: "cursor-for-fifth-page" } })
      .mockReturnValueOnce(mockBrowseResponse)

    mockKvRead.mockReturnValue(JSON.stringify(validSubscriptionWithAlerts));

    const result = await loadAllSubscriptions(config);
    expect(result).toHaveLength(50);
    expect(mockKvBrowse).toHaveBeenCalledTimes(5);
    expect(mockKvBrowse).toHaveBeenNthCalledWith(1, config.accountId, config.kvNamespace, { cursor: undefined });
    expect(mockKvBrowse).toHaveBeenNthCalledWith(2, config.accountId, config.kvNamespace, { cursor: "cursor-for-second-page" });
    expect(mockKvBrowse).toHaveBeenNthCalledWith(3, config.accountId, config.kvNamespace, { cursor: "cursor-for-third-page" });
    expect(mockKvBrowse).toHaveBeenNthCalledWith(4, config.accountId, config.kvNamespace, { cursor: "cursor-for-fourth-page" });
    expect(mockKvBrowse).toHaveBeenNthCalledWith(5, config.accountId, config.kvNamespace, { cursor: "cursor-for-fifth-page" });
    expect(mockKvRead).toHaveBeenCalledTimes(50);
  });

  test("should page through responses from Cloudflare no more than 1000 times", async () => {
    const mockBrowseResponse = {
      errors: [],
      messages: [],
      result: [
        "test1@example.com",
        "test2@example.com",
        "test3@example.com",
        "test4@example.com",
        "test5@example.com",
        "test6@example.com",
        "test7@example.com",
        "test8@example.com",
        "test9@example.com",
        "test10@example.com",
      ],
      success: true,
      result_info: {
        count: 50,
        cursor: "another-cursor"
      }
    }
    mockKvBrowse.mockReturnValue(mockBrowseResponse)

    mockKvRead.mockReturnValue(JSON.stringify(validSubscriptionWithAlerts));

    const result = await loadAllSubscriptions(config);
    expect(result).toHaveLength(10000);
    expect(mockKvBrowse).toHaveBeenCalledTimes(1000);
    expect(mockKvRead).toHaveBeenCalledTimes(10000);
  });
});
