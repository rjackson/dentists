export type Config = {
    apiToken: string;
    accountId: string;
    kvNamespace: string;
}

export const isConfig = (data: unknown): data is Config => {
    return (
        typeof (data as Config).apiToken === "string" &&
        typeof (data as Config).accountId === "string" &&
        typeof (data as Config).kvNamespace === "string"
    )
}