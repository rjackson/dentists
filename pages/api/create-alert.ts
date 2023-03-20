import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import { AlertConfiguration, isAlertConfiguration } from "lib/notifications/types";
import { addAlert } from "lib/notifications/server";

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

  await addAlert(formData.emailAddress, alertConfig);

  return res
    .status(constants.HTTP_STATUS_OK)
    .json({ message: "Created alert" });
};

export default CreateAlert;
