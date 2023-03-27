import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import { unsubscribe, loadSubscription } from "lib/notifications/server";

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

  const subscription = await loadSubscription(formData.emailAddress);

  if (!subscription) {
    return res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .json({ message: "Subscription not found" });
  }

  if (formData.managementUuid !== subscription.managementUuid) {
    return res
      .status(constants.HTTP_STATUS_FORBIDDEN)
      .json({ message: 'Forbidden' });
  }

  await unsubscribe(
    formData.emailAddress,
    formData.managementUuid
  );

  return res
    .status(constants.HTTP_STATUS_OK)
    .json({ ok: true, message: "Deleted alert" });
};

export default Unsubscribe;
