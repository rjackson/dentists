import { createMocks } from 'node-mocks-http';
import SendAlerts from "../../../pages/api/send-alerts";
import loadConfig from "lib/notifications/helpers/loadConfig";
import sendAlerts from 'lib/notifications/jobs/sendAlerts';

jest.mock('lib/notifications/helpers/loadConfig');
jest.mock('lib/notifications/jobs/sendAlerts');

const mockedLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>
const mockedSendAlerts = sendAlerts as jest.MockedFunction<typeof sendAlerts>

const ORIGINAL_CRON_API_KEY = process.env.CRON_API_KEY;

describe("SendAlerts API route", () => {
  beforeEach(() => {
    process.env.CRON_API_KEY = 'test-cron-api-key';
  });

  afterEach(() => {
    process.env.CRON_API_KEY = ORIGINAL_CRON_API_KEY;
  });

  test("should return 'method not allowed' when called with an invalid method", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: {
        authorization: `Bearer ${process.env.CRON_API_KEY}`,
      },
    });

    await SendAlerts(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        message: "Method not allowed"
      }),
    );
  });

  test("should return 'ok' when called with a valid authorization token", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.CRON_API_KEY}`,
      },
    });

    await SendAlerts(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        message: "Processed sendAlerts job"
      }),
    );
    expect(mockedLoadConfig).toHaveBeenCalledTimes(1);
    expect(mockedSendAlerts).toHaveBeenCalledTimes(1);
  });

  test("should return 'unauthorized' when called with an invalid authorization token", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        authorization: `Bearer invalid-token`,
      },
    });

    await SendAlerts(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        message: "Unauthorized"
      }),
    );
  });
});