# dentists on a map

The NHS lists numerous dental practises through the [Find a Dentist](https://www.nhs.uk/service-search/find-a-dentist) service, and its underlying data is available through the NHS' [Service Search API (organisations (version 2))](https://developer.api.nhs.uk/nhs-api/documentation/service-search-organisations-2).

The _Find a Dentist_ service serves a flat list of results. _Dentists on a map_ aims to present the same data in a friendlier format for end users, as well as adding search, filtering & notification capabilities.

## Configuration

This project relies on third-party services:

- [Geonames Web Services](https://www.geonames.org/export/web-services.html) for autocompletion of place names
- [NHS APIs](https://developer.api.nhs.uk/) for the underlying list of Dental services
- [Cloudflare](https://cloudflare.com) for the storage of user data to send notifications (using [Cloudflare KV](https://www.cloudflare.com/en-gb/products/workers-kv/))
- [Sendgrid](https://sendgrid.com) to send email alerts to users who've signed up for them
- [Fathom](https://usefathom.com) (optional) for privacy-conscious web analytics

Configure `.env.local` with credentials for these providers. `.env.example` has been provided as a template for expected settings.

| Environmental variable            | Note                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| NHSDIGITAL_ODATA_ENDPOINT         | Preset to `https://api.nhs` in `.env`.uk/                                                                                      |
| NHSDIGITAL_ODATA_SUBSCRIPTION_KEY | Your subscription key for the NHS API. You can retrieve this from your [My Account](https://developer.api.nhs.uk/profile) page |
| NEXT_PUBLIC_GEONAMES_USERNAME     | Your username for the Geonames Web Services                                                                                    |
| CLOUDFLARE_API_TOKEN              | Your credentials for the Cloudflare API. Needs read and edit access to "Workers KV Storage"                                    |
| CLOUDFLARE_ACCOUNT_ID             | The ID of the Cloudflare account under which the Cloudflare KV namespace is set up                                             |
| CLOUDFLARE_KV_NAMESPACE           | The ID for the Cloudflare KV namespace under which notification data will be saved                                             |
| SENDGRID_API_KEY                  | The API Key for Sendgrid, to send email alerts for new dentists                                                                |
| EMAIL_FROM_NAME                   | What name any e-mails we send should come from                                                                                 |
| EMAIL_FROM_ADDRESS                | What address any e-mails we send should come from                                                                              |
| MAX_DENTISTS                      | Development setting to limit how many dentists are loaded on screen at any one time.                                           |
| CRON_API_KEY                      | Shared secret to authorise a scheduling system to prod API routes for cron jobs.                                               |
| NEXT_PUBLIC_FALLBACK_SITE_URL     | The public site URL to fall back upon if we cannot automatically derive the current site URL (e.g. in Github Actions)          |
| NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN  | Analytics via [Fathom](https://usefathom.com)                                                                                  |
| NEXT_PUBLIC_FATHOM_TRACKING_CODE  | Analytics via [Fathom](https://usefathom.com)                                                                                  |

## Running the Next.js development server

```sh
npm run dev
```

Open <http://localhost:3000> with your browser to see the result.

## Refreshing the dentists data

The list of dentists, and whether they are currently accepting patients, is managed offline and committed into the repository nightly from the [`refresh-data`](./.github/workflows/refresh-data.yml) Github Action.

You can manually update this data locally with:

```sh
npm run refresh-data
```
