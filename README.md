# dentists on a map

The NHS lists numerous dental practises through the [Find a Dentist](https://www.nhs.uk/service-search/find-a-dentist) service, and its underlying data is avaialble through the NHS' [Service Search API (organisations (version 2))](https://developer.api.nhs.uk/nhs-api/documentation/service-search-organisations-2).

But the _Find a Dentist_ service only poses a flat list of results, and doesn't have any filtering capabilities. For example, restricting results to dental practises that are accepting adult NHS patience (my particular use-case!).

This project aims to solve those problems, by adding additional search and filtering capabilities, and plotting the resulting dental practises on a map.

## Configuration

This project relies on two third-party services:

- [Geonames Web Services](https://www.geonames.org/export/web-services.html) for autocompletion of place names
- [NHS APIs](https://developer.api.nhs.uk/) for the underlying list of Dental services

Please register with those two providers, and set the relevant credentials up in a `.env.local` file. `.env.example` has been provided as a template for expected settings.

| Environmental variable              | Note                                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| NHSDIGITAL_ODATA_ENDPOINT           | Preset to `https://api.nhs` in `.env`.uk/                                                                                      |
| NHSDIGITAL_ODATA_SUBSCRIPTION_KEY   | Your subscription key for the NHS API. You can retrieve this from your [My Account](https://developer.api.nhs.uk/profile) page |
| NEXT_PUBLIC_GEONAMES_USERNAME       | Your username for the Geonames Web Services                                                                                    |
| MAX_DENTISTS                        | Development setting to limit how many dentists are loaded on screen at any one time.                                           |
| NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN    | Analytics via [Fathom](https://usefathom.com)                                                                                  |
| NEXT_PUBLIC_FATHOM_TRACKING_CODE    | Analytics via [Fathom](https://usefathom.com)                                                                                  |

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
