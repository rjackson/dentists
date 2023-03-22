import { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import { verifySubscription } from "lib/notifications/server";

// TODO: browser-friendly responses
const VerifySubscription = async (req: NextApiRequest, res: NextApiResponse) => {
    const { emailAddress, managementUuid } = req.query

    if (typeof emailAddress !== "string" || typeof managementUuid !== "string") {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }

    try {
        await verifySubscription(emailAddress, managementUuid)
        return res.status(constants.HTTP_STATUS_OK).end();
    }
    catch (e: unknown) {
        if (!(e instanceof Error)) {
            return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).end();
        }

        switch (e.message) {
            case "Not found":
                return res.status(constants.HTTP_STATUS_NOT_FOUND).end();
            case "Forbidden":
                return res.status(constants.HTTP_STATUS_FORBIDDEN).end();
            default:
                console.trace(e);
                return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).end();
        }
    }

};

export default VerifySubscription;
