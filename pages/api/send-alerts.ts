import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import sendAlerts from "lib/notifications/jobs/sendAlerts";
import loadConfig from "lib/notifications/helpers/loadConfig";

const SendAlerts = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res
      .status(constants.HTTP_STATUS_METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.CRON_API_KEY) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Unauthorized' });
  }

  await sendAlerts(loadConfig())

  return res.status(constants.HTTP_STATUS_OK).json({ message: "Processed sendAlerts job" });
};

export default SendAlerts;
