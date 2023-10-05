interface CodedMessage {
    code: number;
    message: string;
}

interface MessageObject {
    code: number;
    message: string;
}

interface ResultEntry {
    expiration?: number;
    metadata?: object;
    name: string;
}

interface ResultInfoObject {
    count: number;
    cursor: string;
}

// https://developers.cloudflare.com/api/operations/workers-kv-namespace-list-a-namespace'-s-keys
export interface EnterpriseZoneWorkersKvBrowseResponse {
    errors: CodedMessage[];
    messages: MessageObject[];
    result: ResultEntry[];
    success: true;
    result_info: ResultInfoObject;
}

export const isEnterpriseZoneWorkersKvBrowseResponse = (data: unknown): data is EnterpriseZoneWorkersKvBrowseResponse => {
    return (
        (data as EnterpriseZoneWorkersKvBrowseResponse)?.success === true &&
        Array.isArray((data as EnterpriseZoneWorkersKvBrowseResponse)?.errors) &&
        Array.isArray((data as EnterpriseZoneWorkersKvBrowseResponse)?.messages) &&
        Array.isArray((data as EnterpriseZoneWorkersKvBrowseResponse)?.result) &&
        typeof (data as EnterpriseZoneWorkersKvBrowseResponse)?.result_info === "object"
    )
} 