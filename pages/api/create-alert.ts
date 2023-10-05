import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import sendVerificationEmail from "lib/notifications/emails/send-verification-email";
import { AlertConfiguration, isAlertConfiguration } from "lib/notifications/types/AlertConfiguration";
import { addAlert } from "lib/notifications/actions/addAlert";
import loadConfig from "lib/notifications/helpers/loadConfig";

type FormData = AlertConfiguration & {
  emailAddress: string;
}

const isFormData = (data: unknown): data is FormData => {
  return (
    typeof (data as FormData).emailAddress === 'string' &&
    isAlertConfiguration(data)
  )
}

const CreateAlert = async (req: NextApiRequest, res: NextApiResponse) => {
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
      .json({ message: 'Incomplete alert form' });
  }

  const alertConfig: AlertConfiguration = {
    locationName: formData.locationName,
    lat: formData.lat,
    lng: formData.lng,
    radius: formData.radius,
    filters: formData.filters
  }

  const subscription = await addAlert(config, formData.emailAddress, alertConfig);
  const verificationRequired = subscription.verifiedAt === null;

  if (verificationRequired) {
    await sendVerificationEmail(
      subscription,
      alertConfig
    )
  }

  return res
    .status(constants.HTTP_STATUS_OK)
    .json({ ok: true, verificationRequired, message: "Updated subscription" });
};

export default CreateAlert;
