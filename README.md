# dentists on a map

The NHS lists numerous dental practises through the [Find a Dentist](https://www.nhs.uk/service-search/find-a-dentist) service, and its underlying data is avaialble through the NHS' [Service Search API (organisations (version 2))](https://developer.api.nhs.uk/nhs-api/documentation/service-search-organisations-2).

But the _Find a Dentist_ service only poses a flat list of results, and doesn't have any filtering capabilities. For example, restricting results to dental practises that are accepting adult NHS patience (my particular use-case!).

This project aims to solve those problems, by adding additional search and filtering capabilities, and plotting the resulting dental practises on a map.

## Running the Next.js development server:

```sh
npm run dev
```

Open <http://localhost:3000> with your browser to see the result.

## Refreshing the dentists data

[Register for access to NHS APIs](https://developer.api.nhs.uk/register), and set your "Primary key" in `.env.local`

```sh
NHSDIGITAL_ODATA_SUBSCRIPTION_KEY=_YOUR_PRIMARY_SUBSCRIPTION_KEY
```

Then refresh the data with the 'refresh-data' script:

```sh
npm run refresh-data
```
