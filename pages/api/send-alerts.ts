import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";

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

  // TODO

  return res
    .status(constants.HTTP_STATUS_NOT_IMPLEMENTED)
    .json({ message: "Not implemented yet :(" });
};

export default SendAlerts;
