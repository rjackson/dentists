import { Config, isConfig } from "../types/Config";

const loadConfig = (): Config => {

    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const kvNamespace = process.env.CLOUDFLARE_KV_NAMESPACE;

    const maybeConfig = {
        apiToken,
        accountId,
        kvNamespace,
    }

    if (!isConfig(maybeConfig)) {
        throw new Error('Missing parameters for notifications config')
    }

    return maybeConfig;
}

export default loadConfig;