import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import { deleteAlert, loadSubscription } from "lib/notifications/server";

type FormData = {
  emailAddress: string;
  managementUuid: string;
  alertUuid: string;
}

const isFormData = (data: unknown): data is FormData => {
  return (
    typeof (data as FormData).emailAddress === 'string' &&
    typeof (data as FormData).managementUuid === 'string' &&
    typeof (data as FormData).alertUuid === 'string'
  )
}

const DeleteAlert = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res
      .status(constants.HTTP_STATUS_METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
  }

  const formData: unknown = req.body;
  if (!isFormData(formData)) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ message: 'Incomplete delete alert request' });
  }

  const subscription = await loadSubscription(formData.emailAddress);

  if (!subscription || formData.managementUuid !== subscription.managementUuid) {
    return res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .json({ message: "Subscription not found" });
  }

  await deleteAlert(
    formData.emailAddress,
    formData.managementUuid,
    formData.alertUuid
  );

  return res
    .status(constants.HTTP_STATUS_OK)
    .json({ ok: true, message: "Deleted alert" });
};

export default DeleteAlert;
