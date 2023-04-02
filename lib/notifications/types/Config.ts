export type Config = {
    apiToken: string;
    accountId: string;
    kvNamespace: string;
}

export const isConfig = (data: unknown): data is Config => {
    return (
        typeof (data as Config).apiToken === "string" &&
        (data as Config).accountId === "string" &&
        (data as Config).kvNamespace === "string"
    )
}