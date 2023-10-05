// package 'cloudflare' re-throws errors from 'got', but it uses an old version
// of 'got' whose types aren't provided for us. We'll therefore maintain our
// own

type HTTPError = {
    message: string;
    host: string;
    hostname: string;
    method: string;
    path: string;
    statusCode: number;
    statusMessage: string;
}

export const isHTTPError = (data: unknown): data is HTTPError => {
    return (
        typeof (data as HTTPError)?.message === 'string' &&
        typeof (data as HTTPError)?.host === 'string' &&
        typeof (data as HTTPError)?.hostname === 'string' &&
        typeof (data as HTTPError)?.method === 'string' &&
        typeof (data as HTTPError)?.path === 'string' &&
        typeof (data as HTTPError)?.statusCode === 'number' &&
        typeof (data as HTTPError)?.statusMessage === 'string'
    )
}