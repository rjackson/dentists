import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import sendManageEmail from "lib/notifications/emails/send-manage-email";
import { loadSubscription } from "lib/notifications/actions/loadSubscription";
import loadConfig from "lib/notifications/helpers/loadConfig";

type FormData = {
    emailAddress: string;
}

const isFormData = (data: unknown): data is FormData => {
    return (
        typeof (data as FormData).emailAddress === 'string'
    )
}

const SendManageLink = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const subscription = await loadSubscription(config, formData.emailAddress);

    if (subscription) {
        await sendManageEmail(subscription)
    }

    return res
        .status(constants.HTTP_STATUS_OK)
        .json({ ok: true });
};

export default SendManageLink;
