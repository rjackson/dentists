import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import { loadSubscription } from "lib/notifications/server";
import sendManageEmail from "lib/notifications/emails/send-manage-email";

type FormData = {
    emailAddress: string;
}

const isFormData = (data: unknown): data is FormData => {
    return (
        typeof (data as FormData).emailAddress === 'string'
    )
}

const SendManageLink = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const subscription = await loadSubscription(formData.emailAddress);

    if (subscription) {
        await sendManageEmail(subscription)
    }

    return res
        .status(constants.HTTP_STATUS_OK)
        .json({ ok: true });
};

export default SendManageLink;
