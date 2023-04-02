import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import loadConfig from "lib/notifications/helpers/loadConfig";
import { loadSubscription } from "lib/notifications/actions/loadSubscription";
import { unsubscribe } from "lib/notifications/actions/unsubscribe";

type FormData = {
  emailAddress: string;
  managementUuid: string;
}

const isFormData = (data: unknown): data is FormData => {
  return (
    typeof (data as FormData).emailAddress === 'string' &&
    typeof (data as FormData).managementUuid === 'string'
  )
}

const Unsubscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  const config = loadConfig();

  if (req.method !== 'POST') {
    return res
      .status(constants.HTTP_STATUS_METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
  }

  const formData: unknown = req.body;
  if (!isFormData(formData)) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Incomplete unsubscribe request' });
  }

  const subscription = await loadSubscription(config, formData.emailAddress);

  if (!subscription || formData.managementUuid !== subscription.managementUuid) {
    return res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .json({ message: "Subscription not found" });
  }

  await unsubscribe(
    config,
    formData.emailAddress,
    formData.managementUuid
  );

  return res
    .status(constants.HTTP_STATUS_OK)
    .json({ ok: true, message: "Deleted alert" });
};

export default Unsubscribe;
